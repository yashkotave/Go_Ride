import React, {useContext, useEffect} from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";  


const UserProtectedWrapper = ({children}) => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserDataContext);

    useEffect(() => {
        if(!token){
            navigate('/login');
        }else{
          axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            if(response.data.user != null){
              setUser(response.data.user);
              
            }else{
              localStorage.removeItem("token");
              navigate("/login");
            }
            }).catch((error) => {
            // console.log(error);
            localStorage.removeItem("token");
            navigate("/login");
            });
        }
    }, []);

   

  return(
    <>
    {children}
    </>
  )
}

export default UserProtectedWrapper;