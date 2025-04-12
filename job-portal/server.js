/*
 (Backend Entry Point)
     Starts server, connects to DB
 { Starts server + connects to MongoDB}

 I start the backend server and connect everything together.

 Connects to MongoDB using mongoose.connect(...).
Uses express() to start the Node.js server.
Registers your route files like authRoutes.js.
*/


const express = require("express"); // Import Express framework to build REST API
const mongoose = require("mongoose"); // Import Mongoose to connect to MongoDB with Node.js
const dotenv =require("dotenv"); // Import dotenv to load .env variables
const cors = require("cors"); // Import CORS to allow frontend-backend communication
const authRoutes = require("./routes/authRoutes");// ✅ Import routes
const applicationRoutes = require("./routes/Application_2");


dotenv.config();// ✅ Load environment variables from .env file

// ✅ Initialize Express app
const app = express();

// ✅ Middlewares
// const path = require("path");

app.use(express.json()); // Parse JSON bodies in requests
app.use(cors()); // Enable CORS (frontend-backend communication)
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // To serve uploaded files

// Serve uploaded resumes
app.use("/uploads", express.static("uploads"));



// 👇 Route registration (add this line)
app.use("/api", applicationRoutes);


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/resumeAI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// ✅ Get values from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
// || "mongodb://localhost:27017/jobPortal";




// ✅ Use routes
app.use("/api/auth", require("./routes/authRoutes")); // All auth-related APIs start with /api/auth

// 🆕 Step 1: Import Protected Routes
const protectedRoutes = require("./routes/protectedRoutes");

// 🆕 Step 2: Use Protected Routes
app.use("/api/protected", protectedRoutes);

// ✅ Default test route
app.get("/", (req, res) => {
  res.send("Welcome to Job Portal API");
});

// 🚀 Start server
// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





/*

🔍 Code Explanation
1️⃣ require("dotenv").config();

Loads the .env file (where we store secrets like database URLs).

🔹 .env
Keeps sensitive info like DB URLs and API keys secure and separate from code

2️⃣ Importing required packages:

express → Creates the server

mongoose → Connects to MongoDB

cors → Allows requests from frontend (React)

dotenv → Loads environment variables

3️⃣ Creating an Express app (app = express();)

This initializes the backend server.

4️⃣ Middleware Setup:

app.use(cors()); → Enables frontend-backend communication

app.use(express.json()); → Allows JSON data in API requests

5️⃣ Connecting to MongoDB:

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) → Connects our backend to MongoDB

6️⃣ Creating a Test Route:

app.get("/", (req, res) => { res.send("Welcome to Job Portal API"); });

If this works, it confirms that our backend is running.

7️⃣ Starting the Server:

app.listen(PORT, () => { console.log(Server running on http://localhost:${PORT}); });


update we did:
✅ Import routes
const authRoutes = require("./routes/authRoutes");
dotenv.config()
👉 Loads .env variables like MONGO_URI.

app.use(cors())
👉 Allows frontend to call backend (important when hosting frontend separately).

app.use(express.json())
👉 Lets server accept JSON data in request body.

mongoose.connect(...)
👉 Connects your app to MongoDB using your .env file.

app.use("/api/auth", authRoutes)
👉 Connects your authRoutes.js. So now:

POST /api/auth/register

POST /api/auth/login
are valid backend endpoints.

*/