// ─────────────────────────────────────────────────────────
// IMPORTING EXTERNAL PACKAGES
// These are tools installed via npm (node_modules)
// ─────────────────────────────────────────────────────────

const express = require("express");        // Main framework to create server and handle routes
const app = express();                     // Creates the actual Express application instance
const dotenv = require("dotenv");          // Loads environment variables from .env file
const cors = require("cors");              // Allows frontend (React) to communicate with this backend
const cookieParser = require("cookie-parser"); // Enables reading cookies from incoming requests (used for JWT token)

// ─────────────────────────────────────────────────────────
// IMPORTING INTERNAL FILES
// These are files we created inside our own project
// ─────────────────────────────────────────────────────────

const database = require("./config/database");           // Our MongoDB connection logic
const bloodBankRoutes = require("./routes/bloodBankRoutes"); // All blood bank related routes
const hospitalRoutes = require("./routes/hospitalRoutes");   // All hospital related routes
const authRoutes = require("./routes/authRoutes");           // All authentication routes (login, register)
const adminRoutes = require("./routes/adminRoutes");         // All admin related routes
const donorRoutes = require("./routes/donorRoutes");         // All donor related routes
const publicRoutes = require("./routes/publicRoutes");  // ✅ add this
// ─────────────────────────────────────────────────────────
// LOAD ENVIRONMENT VARIABLES
// Reads .env file and makes all variables available
// via process.env throughout the entire project
// Example: process.env.JWT_SECRET, process.env.MONGODB_URL
// ─────────────────────────────────────────────────────────

dotenv.config();

// ─────────────────────────────────────────────────────────
// SET PORT NUMBER
// First checks .env file for PORT value
// If not found, defaults to 4000
// ─────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;

// ─────────────────────────────────────────────────────────
// CONNECT TO MONGODB DATABASE
// Calls our custom connect() function from database.js
// Without this, app starts but cannot read/write any data
// ─────────────────────────────────────────────────────────

database.connect();

// ─────────────────────────────────────────────────────────
// GLOBAL MIDDLEWARES
// These run on EVERY incoming request before reaching routes
// Think of them as security/processing checks at an airport
// ─────────────────────────────────────────────────────────

app.use(express.json());      // Parses incoming JSON data so req.body works properly
                              // Without this, req.body would always be undefined

app.use(cookieParser());      // Parses cookies from request headers
                              // Needed to read JWT token stored in cookies


app.use(
  cors({
    origin: "*",              // Allows requests from ANY frontend URL
                              // In production, replace "*" with your actual frontend URL
    credentials: true,        // Allows cookies and auth headers to be sent with requests
  })
);

// ─────────────────────────────────────────────────────────
// ROUTE HANDLERS
// Directs incoming requests to the correct route file
// based on the URL prefix
//
// Example: POST /api/auth/donor/login
//   → matches "/api/auth" prefix
//   → goes to authRoutes
//   → authRoutes handles "/donor/login" part
// ─────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);           // Handles: /api/auth/donor/login, /api/auth/facility/register etc.
app.use("/api/admin", adminRoutes);         // Handles: /api/admin/pending-facilities, /api/admin/donors etc.
app.use("/api/donor", donorRoutes);         // Handles: /api/donor/profile, /api/donor/nearby-camps etc.
app.use("/api/bloodbank", bloodBankRoutes); // Handles: /api/bloodbank/inventory, /api/bloodbank/camps etc.
app.use("/api/hospital", hospitalRoutes);   // Handles: /api/hospital/blood-request, /api/hospital/profile etc.
app.use("/api/public", publicRoutes);  
// ─────────────────────────────────────────────────────────
// TEST ROUTE
// Simple health check to confirm server is running
// Visit http://localhost:4000/ in browser to test
// ─────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Blood Donation API is running...", // Confirms API is alive
  });
});

// ─────────────────────────────────────────────────────────
// START THE SERVER
// Begins listening for incoming requests on the specified PORT
// The callback function runs once server starts successfully
// You will see "Server is running on port 4000" in terminal
// ─────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});