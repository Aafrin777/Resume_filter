// models/Application.js
//npm start
// http://localhost:3000/applications
const mongoose = require("mongoose");

// 🧱 Define structure of data using a Mongoose Schema
const applicationSchema = new mongoose.Schema({
  fullName: String,        // Name of applicant
  email: String,           // Email address
  phone: String,           // Phone number
  skills: String,          // Skills (comma separated)
  experience: Number,      // Years of experience
  education: String,       // Highest qualification
  resumePath: String,      // Local path to uploaded resume PDF

  extractedText: String, // Resume text
  matchScore: Number, // % match
  matchedSkills: [String], // Which skills matched

  resumeText: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,     // Automatically sets current date/time when document is created
  },

  shortlisted: {
    type: Boolean,
    default: false,
  },

});

module.exports = mongoose.model("Application", applicationSchema);
/*
🧠 Explanation:
- mongoose.Schema: Defines the structure of a document in MongoDB.
- type: Specifies data type (String, Number, etc.).
- default: Date.now -> Automatically saves current timestamp when a new entry is added.
*/
