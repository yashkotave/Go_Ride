import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(import.meta.env.VITE_BASE_URL,{
  transports: ["websocket"],
  withCredentials: true,
});


const SocketProvider = ({ children }) => {

  useEffect(() => {
    
    
    socket.on("connect", () => {
      // console.log("Connected to socket server");
    });
    socket.on("disconnect", () => {
      // console.log("Disconnected from socket server");
    });
    // return () => newSocket.disconnect();
  }, []);

  const sendMessage = (eventName, message) => {
    // console.log(`sending msj ${message}` )
    if (socket) socket.emit(eventName, message);
  };

  const receiveMessage = (eventName, callback) => {
    if (socket) socket.on(eventName, callback);
  };

  return (
    <SocketContext.Provider value={{ socket}}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
