import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData , setUserData] = useState({});
  const [error, setError] = useState('');

  const {user , setUser} = React.useContext(UserDataContext);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const userData = {
      email: email,
      password: password,
    }
    

   try{
    const responce = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

    if(responce.status === 200){
      const data = responce.data;

      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }else{
      // setError('Invalid email or password');
    }

  }catch(err){
    // console.log(err);
    setError('Invalid email or password');
   }

    // console.log(userData);
    
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
        required type="email"
        placeholder="email@example.com"
        className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border-0 w-full text-lg placeholder:text-base"
          />




        <h3 className="text-lg mb-2 font-medium">Enter Password</h3>

        <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required type="password"
        placeholder="Enter password"
        className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border-0 w-full text-lg placeholder:text-base"
         />
<p className="text-red-600">{error}</p>

        <button  className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base">Login</button>

        
      </form>
      <p className="text-center">New here?<Link to='/signup' className="text-blue-600">Create new Account</Link></p>
      </div>
      <div>
        <Link to='/captain-login' className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base">Sign in as captain</Link>
      </div>
    </div>
  );
};

export default UserLogin;
