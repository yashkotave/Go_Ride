import React from "react";

const ConfirmRidePlate = (props) => {
  return (
    <div className="flex flex-col " onClick={() => {
        props.setConfirmRidePopupPanel(true);
    }}>
        <div className="flex justify-center">
        <i
        className="text-3xl text-gray-800 ri-arrow-up-wide-line"
        
      ></i>
        </div>
        <div className="flex justify-between">
        <h2 className="text-black text-2xl font-semibold">Confirm this ride to start</h2>
        <h3 className="text-2xl font-semibold">7Km</h3>
        </div>
    </div>
  );
}

export default ConfirmRidePlate;