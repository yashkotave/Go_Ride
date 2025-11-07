import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { SocketContext } from "../context/SocketContext";
import Nav from "../components/nav";
import LiveTrackingUser from "../components/liveTrackingUser";

const Riding = () => {
  const image = {
    car: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png",

    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",

    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };
  const location = useLocation();
  const ride = location.state?.ride; // retrieve the ride data
  const vehicleType = location.state?.vehicleType; // retrieve the ride data

  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  const [userLocation, setUserLocation] = useState({
        lat: 20.5937,
        lng: 78.9629,
      });

  return (
    <div className="h-screen">
      

      <Nav userLocation={userLocation}/>

  
      <div className="h-1/2 z-[-3]">
        <LiveTrackingUser userLocation={userLocation} setUserLocation={setUserLocation} ride={ride}/>
      </div>



      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img
            className="h-12"
            src={image[vehicleType]}
            alt=""
          />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain.fullname.firstname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain.vehicle.plate}
            </h4>
            <p className="text-sm text-gray-600">
              {vehicleType == "car"
                ? "GoRide-Car"
                : vehicleType == "moto"
                ? "MotorCycle"
                : vehicleType == "auto"
                ? "GoRide-Auto"
                : ""}
            </p>
            {/* <p className="text-sm text-gray-600">{}</p>
            <p className="text-sm text-gray-600">{}</p> */}
          </div>
        </div>

        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
              <i className="text-lg ri-square-fill"></i>
              <div className="">
                <h3 className="text-lg font-medium">{ride?.destination}</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {ride?.destinationDes}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-3 ">
              <i className="text-lg ri-currency-line"></i>
              <div className="">
                <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                <p className="text-sm -mt-1 text-gray-600">Pay Online</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
