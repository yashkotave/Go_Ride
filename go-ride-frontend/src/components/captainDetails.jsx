import React, {useContext} from "react";
import {CaptainDataContext} from "../context/CaptainContext"

const CaptainDetails = () => {

  const {captain} = useContext(CaptainDataContext);

  if (!captain) {
    return <p>Loading...</p>; // Or provide a default UI
  }
    return(
        <div>
              <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
              alt=""
            />
            <h4 className="text-lg font-medium capitalize">{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
          </div>
          <div>
            <h4 className="text-xl font-semibold ">₹{captain.totalEarning}</h4>
            <p className="text-sm text-gray-400">Earned</p>
          </div>
        </div>

        <div className="flex p-5 mt-6 bg-gray-100 rounded-xl justify-center gap-6 items-start">
          <div className="text-center ">
            <i className=" text-3xl mb-2 font-thin ri-history-line"></i>
            <h5 className="text-lg font-medium">{Math.round(captain.totalDistance / 60)}</h5>
            <p className="text-sm text-gray-600">Hours online</p>
          </div>
          <div className="text-center ">
            <i className=" text-3xl mb-2 font-thin ri-speed-up-line"></i>
            <h5 className="text-lg font-medium">{captain.totalTime} Km</h5>
            <p className="text-sm text-gray-600">Distance cover</p>
          </div>
          <div className="text-center ">
            <i className=" text-3xl mb-2 font-thin ri-booklet-line"></i>
            <h5 className="text-lg font-medium">{captain.totalRide}</h5>
            <p className="text-sm text-gray-600">Total Job</p>
          </div>
        </div>
        </div>
    )
}


export default CaptainDetails;