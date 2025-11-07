import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainSignup = () => {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userData, setUserData] = useState({});

    const [vehicleColor, setVehicleColor] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleCapacity, setVehicleCapacity] = useState("");

      const [error, setError] = useState('');
      const[errorPath, setErrorPath] = useState('');

    const {captain, setCaptain} = React.useContext(CaptainDataContext);
  
    const submitHandler = async (e) => {
      e.preventDefault();

      setError('');
      setErrorPath('');
      
      const captainData = {
        fullname: {
          firstname: firstName,
          lastname: lastName,
        },
        email: email,
        password: password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          vehicleType: vehicleType,
          capacity: vehicleCapacity,
        },
      };

    try{
      const responce = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

      if(responce.status === 201){
        const data = responce.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }
    }catch (error) {
      console.error("Error signing up:", error);
      // console.log( "error is : " ,error.response.data.errors[0].msg);
      setError(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'An error occurred');
      setErrorPath(error.response?.data?.errors?.[0]?.path || 'email');
    }
      

      // setEmail("");
      // setPassword("");
      // setFirstName("");
      // setLastName("");
      // setVehicleColor("");
      // setVehiclePlate("");
      // setVehicleType("");
      // setVehicleCapacity("");
    };
  
  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
    <div>
    <img className="w-33 -ml-2 mb-8" src="/log.png" alt="" />

      <form onSubmit={submitHandler}>
        <h3 className="text-base mb-2 w-full font-medium">What's our Captain's name</h3>
        <div className="flex gap-4 mb-6">
          <input
            required
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-[#eeeeee] w-1/2  rounded px-4 py-2 border-0  text-base placeholder:text-sm"
          />

          <input
            required
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-[#eeeeee] w-1/2  rounded px-4 py-2 border-0 text-base placeholder:text-sm"
          />
        </div>

        <p className="text-red-500 mb-3 text-sm">{errorPath == "fullname.firstname" ? error : errorPath == "fullname.lastname" ? error : ""}</p>
        

        <h3 className="text-base mb-2 font-medium">What's our Captain's Email</h3>

        <input
          required
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border-0 w-full text-base placeholder:text-sm"
        />
        <p className="text-red-500 mb-3 text-sm">{errorPath == "email" ? error : ""}</p>

        <h3 className="text-base mb-2 font-medium">Enter Password</h3>

        <input
          required
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border-0 w-full text-base placeholder:text-sm"
        />
        <p className="text-red-500 mb-3 text-sm">{errorPath == "password" ? error : ""}</p>

        <h3 className="text-base mb-2 font-medium">Vehicle Information</h3>

        <div className="flex gap-4 mb-6">
          <input
            required
            type="text"
            placeholder="Vehicle Color"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border-0 text-base placeholder:text-sm"
          />

          <input
            required
            type="text"
            placeholder="Vehicle Plate"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border-0 text-base placeholder:text-sm"
          />
        </div>

        <div className="flex gap-4 mb-6">
          

          <input
            required
            type="number"
            placeholder="Vehicle Capacity"
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border-0 text-base placeholder:text-sm"
          />
          <select
            required
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border-0 text-base placeholder:text-sm"
          >
            <option value="" disabled>Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="moto">Moto</option>
            <option value="auto">Auto</option>
          </select>

        </div>

        <p className="text-red-500 mb-3 text-sm">{errorPath == "vehicle.color" || errorPath == "vehicle.plate"   ? error : ""}</p>

        <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base">
          Create account
        </button>
      </form>
      <p className="text-center">
        Already have a account?
        <Link to="/captain-login" className="text-blue-600">
          Login here
        </Link>
      </p>
    </div>
    <div>
    <p className="text-[9px] leading-tight">
        This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and <span className="underline">Terms of Service apply.</span>
        </p>
    </div>
  </div>
  );
}

export default CaptainSignup;