import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import axios from "axios";
import React, { useEffect, useState } from "react";

const LiveTrackingUser = (props) => {
  // const [userLocation, setUserLocation] = useState({
  //   lat: 37.7749,
  //   lng: -122.4194,
  // });

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

  // console.log(props.ride);

  const [directionPTD, setDirectionPTD] = useState(null);

  useEffect(() => {
    if (
      window.google &&
      props.ride?.captain?.location?.ltd &&
      destinationCoordinates?.lat
    ) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: props.ride?.captain?.location?.ltd, lng: props.ride?.captain?.location?.lng },
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
      {props?.userLocation &&  props.ride?.status != "ongoing" && (
        <Marker
          position={props?.userLocation}
          icon={
            (window.google &&
              props.ride?.captain?.location && {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 12,
                strokeColor: "#4285F4",
                strokeOpacity: 0.4,
              }) ||
            {}
          }
        />
      )}
      {pickupCoordinates?.lat && pickupCoordinates?.lng && props.ride.status == "accepted" && (
        <Marker
          position={pickupCoordinates}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
      )}

      {props.ride?.captain?.location && (
        <Marker
          position={{
            lat: props.ride?.captain?.location?.ltd,
            lng: props.ride?.captain?.location?.lng,
          }}
          icon={
            props.ride?.vehicleType == "car"
              ? {
                  url: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
                  scaledSize: new window.google.maps.Size(40, 45),
                }
              : props.ride?.vehicleType == "moto"
              ? {
                  url: "http://maps.google.com/mapfiles/ms/icons/cycling.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }
              : props.ride?.vehicleType == "auto"
              ? {
                  url: "https://cdn-icons-png.flaticon.com/512/4786/4786827.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }
              : {}
          }
        />
      )}

      {destinationCoordinates?.lat && destinationCoordinates?.lng &&  (
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
            props.ride.status == "ongoing"
              ? directionPTD
              : props.ride.status == "accepted"
              ? directonsDTP
              : []
          }
          options={{
            strokeColor: "#2e2d2d",
            strokeOpacity: 0,
            strokeWeight: 3,
            icons: [{
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 1,
                scale: 3
              },
              offset: '0',
              repeat: '10px'
            }]
          }}
        />
      )}
    </GoogleMap>
  );
};

export default LiveTrackingUser;
