import React from "react";

const LocationSearchPanel = ({ suggestions, setVehiclePanel,setPickupDes,setDestinationDes, setPanelOpen, setPickup, setDestination, activeField }) => {

  const handleSuggestionClick = (elem) => {
    if (activeField === 'pickup') {
        setPickup(elem.displayName)
        setPickupDes(elem.description)
    } else if (activeField === 'destination') {
        setDestination(elem.displayName)
        setDestinationDes(elem.description)
    }
    // setVehiclePanel(true)
    // setPanelOpen(false)
}

  // sample array for locarion 

  // const locations = [
  //   "Mp-68 wale, plot No.110 , Indrapuri sector c",
  //   "248, Near kapoors cafe, Sheriyansh Coading School, Bhopal",
  //   "12 B , Db mall , MP Nagar , Bhopal",
  // ];
  return (
    <div>
     {
                suggestions.map((elem, idx) => (
                    <div key={idx} onClick={() => handleSuggestionClick(elem)} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
                       <div>
                       <h3 className="font-bold">{elem.displayName}</h3>
                       <h4 className='font-normal text-sm'>{elem.description}</h4>
                       </div>
                    </div>
                ))
            }

    </div>
  );
}

export default LocationSearchPanel;