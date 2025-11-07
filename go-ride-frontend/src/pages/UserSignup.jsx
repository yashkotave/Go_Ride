import React, { Suspense, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import { UserDataContext } from "../context/UserContext";



const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const[errorPath, setErrorPath] = useState('');
  

  const navigate = useNavigate();
  const {user, setUser} = React.useContext(UserDataContext);

  const submitHandler = async (e) => {
    setError('');
    setErrorPath('');
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    if(response.status === 201){
      const data = response.data;

      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }
  }catch (error) {
    // console.error("Error signing up:", error);
    // console.log( "error is : " ,error.response.data.errors[0].msg);
    setError(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'An error occurred');
    setErrorPath(error.response?.data?.errors?.[0]?.path || 'email');
  }

   


    // setEmail("");
    // setPassword("");
    // setFirstName("");
    // setLastName("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
      <img className="w-33 -ml-2 mb-8" src="/log.png" alt="" />

        <form onSubmit={submitHandler}>
          <p>{error}</p>
          <h3 className="text-base mb-2 font-medium">What's your Name</h3>
          <div className="flex gap-4 mb-3 ">
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

          <h3 className="text-base mb-2 font-medium">What's your Email</h3>

          <input
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-3 rounded px-4 py-2 border-0 w-full text-base placeholder:text-sm"
          />
          <p className="text-red-500 mb-3 text-sm">{errorPath == "email" ? error : ""}</p>

          <h3 className="text-base mb-2 font-medium">Enter Password</h3>

          <input
            required
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-3 rounded px-4 py-2 border-0 w-full text-base placeholder:text-sm"
          />
          <p className="text-red-500 mb-3 text-sm">{errorPath == "password" ? error : ""}</p>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Create account
          </button>
        </form>
        <p className="text-center">
          Already have a account?
          <Link to="/login" className="text-blue-600">
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
};

export default UserSignup;
