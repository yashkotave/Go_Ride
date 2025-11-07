const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const { initializeSocket } = require("./socket");

const server = http.createServer(app);
const io = initializeSocket(server); // initialize socket.io

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
