import React, { useState, useContext, useEffect } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const {captain , setCaptain} = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
    }else{
      axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if(response.data.captain != null){
          setCaptain(response.data.captain);
          setIsLoading(false);
        }else{
          localStorage.removeItem("token");
          navigate("/captain-login");
        }
        }).catch((error) => {
        // console.log(error);
        localStorage.removeItem("token");
        navigate("/captain-login");
        });
    }



  }, [])

   
  
  
  


  if(isLoading){
    return <div>Loading...</div>
  }

  return <>{children}</>;
};

export default CaptainProtectedWrapper;
