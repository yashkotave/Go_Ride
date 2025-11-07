const captainModel = require("../models/captain.model");
const rideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");
const mapService = require("./maps.service");
const crypto = require("crypto");
const userModel = require("../models/user.model");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are require");
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  // console.log(distanceTime);

  const BASE_FARES = {
    car: 30,
    auto: 23,
    moto: 14,
  };

  const PER_KM_RATES = {
    car: 9,
    auto: 7,
    moto: 5,
  };

  const PER_MIN_RATES = {
    car: 1.2,
    auto: 0.78,
    moto: 0.35,
  };

  const fares = {
    car: Math.round(
      BASE_FARES.car +
        distanceTime.distance * PER_KM_RATES.car +
        distanceTime.duration * PER_MIN_RATES.car
    ),
    auto: Math.round(
      BASE_FARES.auto +
        distanceTime.distance * PER_KM_RATES.auto +
        distanceTime.duration * PER_MIN_RATES.auto
    ),
    moto: Math.round(
      BASE_FARES.moto +
        distanceTime.distance * PER_KM_RATES.moto +
        distanceTime.duration * PER_MIN_RATES.moto
    ),
  };

  return fares;
}

module.exports.getFare = getFare;

function getOTP(num) {
  return crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1)
    .toString();
}



module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
  pickupDes,
  destinationDes,
}) => {
  if (
    !user ||
    !destination ||
    !pickup ||
    !vehicleType ||
    !pickupDes ||
    !destinationDes
  ) {
    throw new Error("All fields are required");
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const fare = await getFare(pickup, destination);

  // console.log(fare);

  const ride = rideModel.create({
    user,
    pickup,
    pickupDes,
    destination,
    destinationDes,
    otp: getOTP(6),
    fare: fare[vehicleType],
    distance: Math.round(distanceTime.distance),
    duration: distanceTime.duration,
    createdAt: Date.now(),
    vehicleType: vehicleType
  });

  return ride;
};

module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const ride = await rideModel
    .findOne({ _id: rideId })
    .populate("user")
    .populate("captain")
    .select("+otp");

  // console.log("111111111");
  // console.log(ride);

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }
   await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  ride.status = "ongoing";

  
  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride is is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride is not ongoing");
  }



  await captainModel.findByIdAndUpdate(
    { _id: captain._id },
    {
      $push: { rideHistory: rideId },
      $inc: { totalRide: 1, totalDistance: ride.distance,totalEarning : ride.fare , totalTime: ride.duration },
      
    }
  );

  await rideModel.findOneAndUpdate({ _id: rideId }, { status: "completed" });

  

  await userModel.findByIdAndUpdate(
    { _id: ride.user._id },
    { $push: { rideHistory: rideId } }
  );
  

  return ride;
};
