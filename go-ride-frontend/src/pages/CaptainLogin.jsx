import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {CaptainDataContext} from "../context/CaptainContext";


const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const {captain, setCaptain} = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password: password,
    };

    try{
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain);

    if (response.status === 200) {
      const data = response.data;

      setCaptain(data.captain);
      localStorage.setItem("token",data.token);
      
      navigate("/captain-home");
    }
    }catch(err){
      // console.log(err);
      setError('Invalid email or password');
    }
    
    
    
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-33 -ml-2 mb-8" src="/log.png" alt="" />

        <form onSubmit={submitHandler}>
          <h3 className="text-lg mb-2 font-medium">What's your Email</h3>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="email@example.com"
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border-0 w-full text-lg placeholder:text-base"
          />

          <h3 className="text-lg mb-2 font-medium">Enter Password</h3>

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Enter password"
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border-0 w-full text-lg placeholder:text-base"
          />
          <p className="text-red-600">{error}</p>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          Join a fleet?{" "}
          <Link to="/captain-signup" className="text-blue-600">
            Register as a Captian
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/login"
          className="bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
