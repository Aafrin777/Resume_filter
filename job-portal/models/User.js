/* models/User.js
  Defines what data looks like
 [ Mongoose Schema for user data ]
*/


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");   // Import bcrypt for password hashing
// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true, // Prevent duplicate emails
        lowercase: true, // Store email in lowercase
        trim: true, // Remove unnecessary spaces
    },
    password: {
        type: String,
        required: true, // Password is required
        minlength: 6, // Minimum password length
    },
    role: {
        type: String,
        enum: ["seeker", "employer"], // ✅ Now "user" is valid too / makes sure only specific roles are allowed
        default: "seeker",
        required: true,
    },
}, { timestamps: true }); // Automatically adds createdAt & updatedAt

// Pre-save hook to hash password before saving to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // If password not changed, skip

    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed to save
  });

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;


/*
 What Does This Code Do?

 we are using MongoDB to store data, but we're not writing raw MongoDB queries directly.

Instead, we are using a library called Mongoose, which is a tool to connect and work with MongoDB using JavaScript/Node.js in a more structured way.

Mongoose = Bridge between MongoDB and Node.js
👉 We are defining a blueprint of what a User should look like in MongoDB.


1️⃣ Defines a userSchema → This is the structure of user data in MongoDB.

2️⃣ Fields Explanation:

name → Stores the user's full name (required)

email → Stores the user's email (must be unique & lowercase)

password → Stores the user's hashed password

role → Defines whether the user is a jobseeker or employer

timestamps: true → Adds createdAt & updatedAt fields automatically
3️⃣ Exports the User model → So we can use it in other files (like routes).



-----------------------------------------------------------------------------------------------------------------------------------------------



*/