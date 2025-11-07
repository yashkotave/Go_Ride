import React from "react";

const RidePopUp = (props) => {
    return(
        <div>
             <h5 className="p-1 text-center w-[93%] absolute top-0 ">
        <i
          className="text-3xl text-gray-300 ri-arrow-down-wide-line"
          onClick={() => {
           props.setRidePopupPanel(false);
          }}
        ></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">New Ride Available</h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3">
        <div className="flex items-center gap-3">
            <img className="h-12 w-12 rounded-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw9tk89YzCM4exFNWNbbG4vRalCVHIVNUWyw&s" alt="" />
            <h2 className="text-lg font-medium">{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
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
              <h3 className="text-lg font-medium">{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Pay Online
              </p>
            </div>
          </div>

        </div>
        <div className="flex w-full  mt-5 items-center justify-between">
        <button onClick={ () => {
            props.setRidePopupPanel(false);
        }} className=" bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg">
          Ignore
        </button>

        <button onClick={() => {
          props.setRidePopupPanel(false);
          // props.setConfirmRidePopupPanel(true);
          props.setConfirmRidePlate(true);
          props.confirmRide()
        }} className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Accept
        </button>

        
        </div>
      </div>
        </div>
    )
}

export default RidePopUp;