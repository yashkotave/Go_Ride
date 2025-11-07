import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainLogout = () => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response) => {
       if(res.status ==  200){
            localStorage.removeItem('token');
            navigate('/captain-login');
       }
    })
    .catch((error) => {
        // console.log(error);
    });

    

  return (
    <div>
      <h1>Captain Logout</h1>
    </div>
  );
}

export default CaptainLogout;