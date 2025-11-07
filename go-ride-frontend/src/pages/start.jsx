import React from "react";
import {Link} from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url(https://plus.unsplash.com/premium_photo-1731842686156-74895c29a87b?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-7  flex justify-between flex-col w-full">
        <img className="w-36 ml-3" src="/log.png" alt="" />
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold">Get started with GoRide</h2>
          <Link to='/login' className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5">Continue</Link>
          
        </div>
      </div>
    </div>
  );
}

export default Start;