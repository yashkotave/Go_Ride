import React from "react";


const WaitingForDriver = (props) => {

  const image = {
    car : "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png",

    moto:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",

    auto:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
  }
    return(
        <div>
        <h5 className="p-1 text-center w-[93%] absolute top-0 ">
          <i
            className="text-3xl text-gray-300 ri-arrow-down-wide-line"
            onClick={() => {
              props.setWaitingForDriver(false);
            }}
          ></i>
        </h5>
  
        <div className="flex items-center justify-between">
        <img
          className="h-12"
          src={image[props.vehicleType]}
          alt=""
        />
        <div className="text-right">
            <h2 className="text-lg font-medium capitalize">{props.ride?.captain.fullname.firstname + " " + props.ride?.captain.fullname.lastname} </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">{props.ride?.captain.vehicle.plate}</h4>
            <p className="text-sm text-gray-600">{props.vehicleType == "car"
                ? "GoRide-Car"
                : props.vehicleType == "moto"
                ? "MotorCycle"
                : props.vehicleType == "auto"
                ? "GoRide-Auto"
                : ""}</p>
            <h1 className="text-lg font-semibold"> OTP : {props.ride?.otp}</h1>
        </div>
        </div>
  
        <div className="flex gap-2 justify-between flex-col items-center">
          
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
              <i className="text-lg ri-map-pin-range-fill"></i>
              <div className="">
                <h3 className="text-lg font-medium">{props.ride?.pickup}</h3>
                {/* <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickupDes}
                </p> */}
              </div>
            </div>
  
            <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
              <i className="text-lg ri-square-fill"></i>
              <div className="">
                <h3 className="text-lg font-medium">{props.ride?.destination}</h3>
                {/* <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destinationDes}
                </p> */}
              </div>
            </div>
  
            <div className="flex items-center gap-5 p-3 ">
              <i className="text-lg ri-currency-line"></i>
              <div className="">
                <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
                <p className="text-sm -mt-1 text-gray-600">Pay Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}


export default WaitingForDriver;