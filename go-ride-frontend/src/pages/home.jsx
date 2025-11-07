import { useGSAP } from "@gsap/react";
import axios from "axios";
import gsap from "gsap";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import ConfirmRide from "../components/confirmRide";

import LocationSearchPanel from "../components/locationSearchPanel";
import LookingForDriver from "../components/lookingForDriver";
import Nav from "../components/nav";
import VehiclePanel from "../components/vehiclepanle";
import WaitingForDriver from "../components/waitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import LiveTrackingUser from "../components/liveTrackingUser";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [pickupDes, setPickupDes] = useState("");
  const [destinationDes, setDestinationDes] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const navigate = useNavigate();

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);

  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});

  const [vehicleType, setVehicleType] = useState(null);

  const [pd, setPd] = useState();
  const [dd, setDd] = useState();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const [ride, setRide] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // console.log(user);
    socket.emit("join", { userType: "user", userId: user._id });
  });

  socket.on("ride-confirmed", (ride) => {
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride, vehicleType } }); // pass ride data here
  });
  
  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response.data);
      setPickupSuggestions(response.data);
    } catch (err) {
      // handle error
      // console.log(err);
    }
  };
  function clickhandler() {
    // console.log("clicked");
  }
  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch {
      // handle error
    }
  };

  const findPanelRef = useRef(null);

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 0,
          opacity: 1,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
        gsap.to(findPanelRef.current, {
          justifyContent: "flex-end",
          top: "0",
          height: "screen",
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0",
          padding: 0,
          opacity: 0,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
        gsap.to(findPanelRef.current, {
          justifyContent: "flex-start",
          top: "auto",
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  // const [profilePanel, setProfilePanel] = useState(false);
  // const profilePanelRef = useRef(null);

  // useGSAP(
  //   function () {
  //     if(profilePanel) {
  //       gsap.to(profilePanelRef.current, {
  //         transform: 'translateX(0)',
  //       });
  //     } else {
  //       gsap.to(profilePanelRef.current, {
  //         transform: 'translateX(100%)',
  //       });
  //     }
  //   },
  //   [profilePanel]
  // );

  function setDescription() {
    setPd(pickupDes);
    setDd(destinationDes);
  }
  const [locationError, setLocationError] = useState("");

  async function findTrip() {
    if (pickup === "") {
      setLocationError("Pickup location cannot be empty");
      return;
    }
    if (destination === "") {
      setLocationError("Destination location cannot be empty");
      return;
    }
    if (pickup === destination) {
      setLocationError("Pickup and destination cannot be the same");
      return;
    }
    setVehiclePanel(true);
    setPanelOpen(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setFare(response.data);
    // console.log(response.data);
  }
  const [captainLocation, setCaptainLocation] = useState({});

  async function createRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
        pickupDes,
        destinationDes,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // console.log(response.data);

    setCaptainLocation({ lat: 20.5937, lng: 78.9629 });
  }

  const [userLocation, setUserLocation] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  return (
    <div className="h-screen relative overflow-hidden">
      {/* <div ref={profilePanelRef}   className="fixed top-0 right-0 h-full w-[100%] bg-white shadow-lg transform translate-x-full  z-[100] p-6">
<ProfilePanel setProfilePanel={setProfilePanel} userLocation={userLocation}/>
</div> */}

      <Nav userLocation={userLocation} />

      {/* 
      <div className="flex flex-row relative z-[1] justify-between items-center bg-white h-15 px-4">
      <img
        className="w-24"
        src="/log.png"
        alt=""
      />
      <div className="rounded-full">
      <button onClick={() => {
        setProfilePanel(true)
      }} className="cursor-pointer">
              <i  className="ri-account-circle-fill text-2xl"></i>
      </button>
      </div>
      </div> */}

      <div className="h-3/5">
        {/* image for temporary use */}
        <LiveTrackingUser
          setUserLocation={setUserLocation}
          userLocation={userLocation}
          ride = {ride}
        />
      </div>

      <div
        ref={findPanelRef}
        className=" flex flex-col h-screen absolute  w-full "
      >
        <div className=" p-6 bg-white relative z-[1]">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute top-6 right-5 text-2xl opacity-0"
          >
            <i className="ri-arrow-down-wide-line text-2xl"></i>
          </h5>

          <h4 className="text-2xl font-semibold ">Find a trip</h4>

          <form onSubmit={(e) => submitHandler(e)}>
            <div className="line absolute h-16 w-1 top-[37%] left-10 bg-gray-700 rounded-full"></div>
            <input
              className="bg-[#eeeeee] px-12 py-2 text-base rounded-lg w-full mt-5"
              type="text"
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
                setLocationError("");
              }}
              value={pickup}
              onChange={handlePickupChange}
              name=""
              id=""
              placeholder="Add a pickup location"
            />
            <input
              className="bg-[#eeeeee] px-12 py-2 text-base rounded-lg w-full mt-3"
              type="text"
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
                setLocationError("");
              }}
              value={destination}
              onChange={handleDestinationChange}
              name=""
              id=""
              placeholder="Enter your destination"
            />
            <p className="text-red-600 text-sm pl-2">{locationError}</p>
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find trip
          </button>
        </div>

        <div ref={panelRef} className=" bg-white  h-0 overflow-hidden pt-1 ">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setVehiclePanel={setVehiclePanel}
            setPanelOpen={setPanelOpen}
            setPickupDes={setPickupDes}
            setDestinationDes={setDestinationDes}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full py-10 px-3 bg-white pt-12"
      >
        <VehiclePanel
          fare={fare}
          selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          setDescription={setDescription}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full py-6 px-3 bg-white pt-12"
      >
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          pickupDes={pd}
          destinationDes={dd}
          fare={fare}
          vehicleType={vehicleType}
          createRide={createRide}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full py-6 px-3 bg-white pt-12"
      >
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          pickupDes={pd}
          destinationDes={dd}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-10 bottom-0  py-6 px-3 bg-white pt-12"
      >
        <WaitingForDriver
          vehicleType={vehicleType}
          ride={ride}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
