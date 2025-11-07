const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");


let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL, // Allow only your frontend
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization", "Content-Type"]
      
    },
    transports: ["polling","websocket"], // Force WebSocket first
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);


    socket.on("join", async (data) => {
        const {userId , userType} = data;

        console.log(`User ${userId} joined as ${userType}`)
        console.log(`socket id is : ${socket.id}`)

        if(userType == "user"){
            await userModel.findByIdAndUpdate(userId, {
                socketId:socket.id
            })
            
        }else if(userType == "captain"){
            await captainModel.findByIdAndUpdate(userId, {
                socketId:socket.id
            })
        }

        socket.on("update-location-captain", async (data) => {
          const { userId ,  location } = data;

          if (!location || !location.ltd || !location.lng) {
            return socket.emit('error', {message : 'Invalid location data'});
          }

          console.log(`User ${userId} update location to ${location}`);

            await captainModel.findByIdAndUpdate(userId, {
              location:{
                ltd : location.ltd,
                lng : location.lng,
              }
            } );
         
        })

        socket.on('disconnect', () => {
            console.log(`Clint disconnected : ${socket.id}`);
        });
    })

    
  });
}

function sendMessageToSocketId(socketId, messageObject) {

  console.log(`Sending message to ${socketId}` , messageObject);
  if(io){
    io.to(socketId).emit(messageObject.event, messageObject.data);
  }else{
    console.log('Socket.io not initialize.')
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };
