import axios from 'axios';
import React from 'react'
import{useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import { useState } from 'react';

function ProfilePanel(props) {


    const navigate = useNavigate();

    const [profile, setProfile] = React.useState({});
 

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    // console.log(profile);

    const [locationInfo, setLocationInfo] = React.useState("India");

    React.useEffect(() => {
        const getLocationInfo = async () => {
            if (props.userLocation.lat && props.userLocation.lng) {
                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${props.userLocation.lat}&lon=${props.userLocation.lng}`
                    );
                    setLocationInfo(response.data.address.city + ", " + response.data.address.state + ", " + response.data.address.country || response.data.address.state + ", " + response.data.address.country || response.data.address.country);
                } catch (error) {
                    console.error('Error fetching location info:', error);
                    setLocationInfo('Location not found');
                }
            }
        };
        
        getLocationInfo();
    }, [props.userLocation]);

    // console.log(locationInfo);

    const handleLogout = async () => {
        // console.log("ckkk")
        try {
            
            await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/login');
            localStorage.removeItem('token');
            window.location.reload();
            n
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };




  return (
    <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      <button onClick={() => props.setProfilePanel(false)}>
        <i className="ri-close-line text-2xl"></i>
      </button>
    </div>
    
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-3">
          <i className="ri-user-fill text-4xl text-gray-400 leading-[96px]"></i>
        </div>
        <h3 className="text-xl font-semibold">{profile?.user?.fullname.firstname + " " + profile?.user?.fullname.lastname}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center p-3 bg-gray-50 rounded">
          <i className="ri-mail-line mr-3"></i>
          <span>{profile?.user?.email}</span>
        </div>
        <div className="flex items-center p-3 bg-gray-50 rounded">
          <i className="ri-map-pin-line mr-3"></i>
          <span>{locationInfo}</span>
        </div>
      </div>


<div>
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-3">Previous Rides</h3>
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {profile?.user?.rideHistory?.map((ride, index) => (
          <div key={index} className="flex-shrink-0 w-64 p-4 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Ride #{index+1}</span>
            <span className="text-sm text-gray-500">₹{ride?.fare}</span>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              From: {ride?.pickup}
            </div>
            <div className="text-sm text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              To: {ride?.destination}
            </div>
            <div className="text-sm text-gray-500">
              <i className="ri-time-line mr-2"></i>
              {new Date(ride?.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  </div>
</div>




      
      <button onClick={ () => {
        handleLogout()
      }} className="w-full bg-black text-white py-3 rounded-lg mt-6">
        Sign Out
      </button>
    </div>
  </div>
  )
}

export default ProfilePanel;