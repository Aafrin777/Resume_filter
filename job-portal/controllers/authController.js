// =========================================
/* 📁 controllers/authController.js
Logic for Register/Login

It doesn’t store the data directly — it just handles the process of saving and checking users using User.js.

// =========================================
 */


// Import necessary packages
const User = require("../models/User"); // User model to interact with MongoDB
const jwt = require("jsonwebtoken"); // For generating login tokens
const bcrypt = require("bcryptjs"); // For hashing passwords securely

// Temporary secret key for signing JWTs (should move to .env for security)
const JWT_SECRET = process.env.JWT_SECRET;

// ============================================
// ✅ REGISTER CONTROLLER - Create New User
// ============================================
// @desc    Registers a new user after validating and hashing password
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
			// req.body = the data sent from frontend (like formData)
 // 1️⃣ Extract user details from the frontend form (request body)
 const { name, email, password, role } = req.body;

        // 2️⃣ Check if any field is missing
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Please fill all fields." });
        }

        // 3️⃣ Check if email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        // 4. Hash the password for security (never store plain passwords)
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

        // 5️⃣ Create a new user document
        const newUser = new User({
            name,
            email,
            password, // Store /Save hashed password
            role,
        });

           // 6. Save the new user to the database [MongoDB]
        await newUser.save();

        // 7️⃣ Send success response
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        // 8️⃣ Handle unexpected errors
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// ============================================
// ✅ LOGIN CONTROLLER - Authenticate User
// ============================================
// @desc    Validates user credentials and returns JWT
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    console.log("📥 Incoming login request:", req.body); // Add this line
        // 1️⃣ Get email and password from request body
        const { email, password } = req.body;
        console.log("🔐 Login request received:", { email, password });


        // 2️⃣ Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password." });

    }

        // 3️⃣ Find user by email
        //.findOne() → checks if user already exists
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const user = await User.findOne({ email: normalizedEmail });
            if (!user) {
                console.log("❌ User not found or Email not registered .");
                return res.status(400).json({ message: "User not found." });
              }

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email not registered ." });
    }
    if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is not set!");
      }
       // 3. Create JWT token
       const token = jwt.sign({
         id: user._id },
         process.env.JWT_SECRET,  { expiresIn: "1h" });
         console.log("JWT_SECRET:", process.env.JWT_SECRET);

        // 6️⃣ Send back the token and user data
        res.status(200).json({
            message: "Login successful",
token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
            });
    } catch (error) {
        // 7️⃣ Handle unexpected errors
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};

// Export both controller functions so routes can use them
module.exports = {
	register,
	login
};


/*
This is where the real logic lives:

For /register:

Checks if user already exists.

Hashes password using bcrypt.

Creates a new user and saves to DB.

For /login:

Finds user by email.

Compares password using bcrypt.

Sends a success or error message.

req.body → holds form data sent from frontend (like formData)

.findOne() → checks if user already exists

.save() → saves new user into the database

🔐 What is a Hash Function?
A hash function is like a magic blender:

You give it some input (like a password),

It mixes it up using a complex mathematical recipe,

And gives you a unique fixed-length scrambled output called a hash.
🔁 Can You “Unhash” It?
Nope ❌. That’s the beauty of a hash — it’s one-way.


🔐 Role of bcrypt:
bcrypt is a special library that:

Hashes passwords using salt (extra randomness)

Protects against brute-force attacks

Makes it super hard to crack passwords
*/
