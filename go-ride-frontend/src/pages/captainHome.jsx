import { useGSAP } from "@gsap/react";
import axios from "axios";
import gsap from "gsap";
import React, { useContext, useEffect, useRef, useState } from "react";
import CaptainNav from "../components/capain-nav";
import CaptainDetails from "../components/captainDetails";
import ConfirmRidePlate from "../components/confirmRidePlate";
import ConfirmRidePopUp from "../components/confirmRidePopUp";

import RidePopUp from "../components/ridePopup";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import LiveTrackingCaptain from "../components/liveTrackingCaptain";


const CaptainHome = () => {
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const confirmRidePlateRef = useRef(null);

  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [confirmRidePlate, setConfirmRidePlate] = useState(false);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  const [ride, setRide] = useState(null);

  const [userLocation, setUserLocation] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  useEffect(() => {
    if (captain) {
      socket.emit("join", { userId: captain._id, userType: "captain" });
    }

    const locationIntervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log({
        //   userId: captain._id,
        //   location: {
        //     ltd: position.coords.latitude,
        //     lng: position.coords.longitude,
        //   },
        // });

        socket.emit("update-location-captain", {
          userId: captain._id,
          location: {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    }, 2000);

    return () => clearInterval(locationIntervalId);
  });

  socket.on("new-ride", (data) => {
    // console.log(data);
    setRide(data);
    setRidePopupPanel(true);
  });
  socket.on("ride-confirmed", (ride) => {
    setRide(ride);
  });
  socket.on("ride-started", (ride) => {
    setRide(ride);
  });

  async function confirmRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captain: captain,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // console.log("responce is : ", response);
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
          visibility:  "visible" ,
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
          visibility:  "hidden" ,
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
          visibility:  "visible" ,
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
          visibility:  "hidden" ,
        });
      }
    },
    [confirmRidePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePlate) {
        gsap.to(confirmRidePlateRef.current, {
          transform: "translateY(0)",
          visibility:  "visible" ,
        });
      } else {
        gsap.to(confirmRidePlateRef.current, {
          transform: "translateY(100%)",
          visibility:  "hidden" ,
        });
      }
    },
    [confirmRidePlate]
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

  return (
    <div className="h-screen">
      {/* <div className="flex flex-row relative z-[20] justify-between items-center bg-white h-15 px-4">
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
      </div>

      <div ref={profilePanelRef}   className="fixed top-0 right-0 h-full w-[100%] bg-white shadow-lg transform translate-x-full  z-[100] p-6">
<CaptainProfilePanel setProfilePanel={setProfilePanel} userLocation={userLocation}/>
</div> */}

      <CaptainNav userLocation={userLocation} />

      <div className="h-3/5">
      
        <LiveTrackingCaptain
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          ride={ride}
        />

      </div>

      <div className="h-2/5 p-4">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full  py-6 px-3 bg-white pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePlate={setConfirmRidePlate}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePlateRef}
        className="fixed w-full translate-y-full z-10 bottom-0 py-6 px-3 bg-green-400 pt-4"
      >
        <ConfirmRidePlate setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full  py-6 px-3 bg-white pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
