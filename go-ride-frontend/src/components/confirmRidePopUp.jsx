import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

   const { socket } = useContext(SocketContext);
   const [ridding,setRidding] = useState(true);
   const [otpError, setOtpError] = useState("");

  const submitHandler = async (e) => {
    setOtpError("");
    e.preventDefault();

    try{
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(" status is : ", response.status);
      if (response.status == 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
  
        navigate("/captain-riding", { state: { ride: props.ride,ridding } });
      }
    }catch (err) {
      setOtpError("Invalid OTP");
    }
  };

  ;
  return (
    <div>
      <h5 className="p-1 text-center w-[93%] absolute top-0 ">
        <i
          className="text-3xl text-gray-300 ri-arrow-down-wide-line"
          onClick={() => {
            props.setConfirmRidePopupPanel(false);
          }}
        ></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to start
      </h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw9tk89YzCM4exFNWNbbG4vRalCVHIVNUWyw&s"
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user.fullname.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">{props.ride?.distance} Km</h5>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-range-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">{props.ride?.pickup}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickupDes}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-square-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">{props.ride?.destination}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destinationDes}
              </p>
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

        <div className="mt-6 w-full">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              type="text"
              placeholder="Enter OTP"
              className="bg-[#eeeeee] px-6 py-4 font-mono rounded-lg w-full mt-5 mb-3"
            />

<p className="text-red-600">{otpError}</p>

            <button className="flex justify-center w-full mt- bg-green-600 text-white text-lg font-semibold p-3 rounded-lg">
              Confirm
            </button>

            <button
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full mt-2 text-lg bg-red-500 text-white font-semibold p-3 rounded-lg"
            >
              Cancle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
