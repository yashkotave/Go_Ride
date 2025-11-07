const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const app = express();

const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");
const cookieParser = require("cookie-parser");

connectToDb();

// ✅ CORS Setup
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow tools like curl or Postman
    const allowedOrigin = process.env.FRONTEND_URL.replace(/\/$/, "");
    if (origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Optional: Handle preflight

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Test Routes
app.get("/", (req, res) => {
  res.send("GoRide backend live on DigitalOcean 🚀");
});

app.get("/test",(req,res) => {
  res.sene("Testing....");
})

// ✅ API Routes
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);

module.exports = app;
