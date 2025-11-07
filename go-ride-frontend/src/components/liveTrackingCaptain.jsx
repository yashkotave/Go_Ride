import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const LiveTrackingCaptain = (props) => {
  // const [userLocation, setUserLocation] = useState({
  //   lat: 37.7749,
  //   lng: -122.4194,
  // });

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    let interval;
    if (navigator.geolocation) {
      const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // console.log(`Position updated :` , position.coords.latitude,position.coords.longitude);
            props.setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            socket.emit("update-location-captain", {
              userId: captain._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          },
          (error) => console.error(),
          { enableHighAccuracy: true, timeout: 1500, maximumAge: 0 }
        );
      };
      updateLocation(); // update immediately
      interval = setInterval(updateLocation, 2000);
    } else {
      // console.error("Geolocation is not supported by this browser.");
    }
    return () => clearInterval(interval);
  }, []);

  const [pickupCoordinates, setPickupCoordinates] = useState({});
  // console.log(props.ride?.pickup);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
          {
            params: {
              address: props.ride?.pickup, // Make sure to pass the address as a query parameter
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
            },
          }
        );
        // Handle the response data here
        // console.log(response.data);
        setPickupCoordinates(response.data);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (props.ride?.pickup) {
      getCoordinates();
    }
  }, [props.ride?.pickup]);

  const [destinationCoordinates, setDestinationCoordinates] = useState({});

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
          {
            params: {
              address: props.ride?.destination, // Make sure to pass the address as a query parameter
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication token
            },
          }
        );
        // Handle the response data here
        // console.log(response.data);
        setDestinationCoordinates(response.data);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (props.ride?.destination) {
      getCoordinates();
    }
  }, [props.ride?.destination]);

  const [directionPTD, setDirectionPTD] = useState(null);

  useEffect(() => {
    if (
      window.google &&
      props.userLocation?.lat &&
      destinationCoordinates?.lat
    ) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: props.userLocation.lat, lng: props.userLocation.lng },
          destination: {
            lat: destinationCoordinates.lat,
            lng: destinationCoordinates.lng,
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            // Extract path from the response
            const path = result.routes[0].overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }));
            setDirectionPTD(path);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [props.userLocation, destinationCoordinates]);

  const [directonsDTP, setDirectonsDTP] = useState(null);

  useEffect(() => {
    if (window.google && pickupCoordinates?.lat && props.userLocation?.lat) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: props.userLocation.lat, lng: props.userLocation.lng },
          destination: {
            lat: pickupCoordinates.lat,
            lng: pickupCoordinates.lng,
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            // Extract path from the response
            const path = result.routes[0].overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }));
            setDirectonsDTP(path);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [pickupCoordinates, props.userLocation]);


  return (
    <GoogleMap
      mapContainerStyle={{ height: "100%", width: "100%" }}
      center={{
        lat: props.userLocation?.lat,
        lng: props.userLocation?.lng,
      }}
      zoom={15}
    >
      {props.userLocation && (
        <Marker
          position={props.userLocation}
          icon={
            props.ride?.vehicleType == "car" && props.ride?.status != "pending"
              ? {
                  url: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
                  scaledSize: new window.google.maps.Size(40, 45),
                }
              : props.ride?.vehicleType == "moto" && props.ride?.status != "pending"
              ? {
                  url: "http://maps.google.com/mapfiles/ms/icons/cycling.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }
              : props.ride?.vehicleType == "auto" && props.ride?.status != "pending"
              ? {
                  url: "https://cdn-icons-png.flaticon.com/512/4786/4786827.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }
              : {}
          }
        />
      )}
      { pickupCoordinates?.lat && pickupCoordinates?.lng && props.ride?.status != "pending" &&  (
        <Marker
          position={pickupCoordinates}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/micons/green.png",
          }}
        />
      )}

      {destinationCoordinates?.lat && destinationCoordinates?.lng &&  props?.ridding && (
        <Marker
          position={destinationCoordinates}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/micons/red.png",
          }}
        />
      )}

      {directionPTD && (
        <Polyline
          path={
            props.ridding
              ? directionPTD
              : props.ride.status == "accepted"
              ? directonsDTP
              : []
          }
          options={{
            strokeColor: "#2e2d2d",
            strokeOpacity: 0.7,
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default LiveTrackingCaptain;
