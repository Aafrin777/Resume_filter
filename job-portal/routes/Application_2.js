// routes/Application_2.js
//npm install pdf-parse


const express = require("express");
const router = express.Router();

// 📦 Multer is used to handle file uploads like resumes
const multer = require("multer");

// 📂 Node’s built-in module to work with file and directory paths
const path = require("path");

const fs = require("fs"); // 📂 For reading uploaded file
const pdfParse = require("pdf-parse"); // 📄 To extract text from PDF

// 📄 Mongoose model for saving application data
const Application = require("../models/Application");




// ✅ Define desired skills (can also be dynamic later)
const desiredSkills = [
  "javascript", "react", "node", "express", "mongodb",
  "html", "css", "python", "java", "c++" , "DSA" ," vita"
];

// 🔍 Match resume text with skills
const matchSkills = (resumeText, desiredSkills) => {
  const matched = [];

  // Normalize text to lowercase
  const text = resumeText.toLowerCase();

  desiredSkills.forEach((skill) => {
    if (text.includes(skill.toLowerCase())) {
      matched.push(skill);
    }
  });

  const matchScore = Math.round((matched.length / desiredSkills.length) * 100);

  router.put("/shortlist/:id", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { shortlisted } = req.body;

      const updatedApp = await Application.findByIdAndUpdate(
        applicationId,
        { shortlisted },
        { new: true }
      );

      res.status(200).json(updatedApp);
    } catch (err) {
      console.error("Error updating shortlist:", err);
      res.status(500).json({ error: "Server error" });
    }
  });


  return { matchedSkills: matched, matchScore };
};



/* --------------------------- FILE UPLOAD SETUP --------------------------- */

// 📍 1. Configure where and how the files will be saved

/* ----------------- MULTER STORAGE CONFIGURATION ----------------- */
const storage = multer.diskStorage({
  // ✅ 'destination' defines the folder to save uploaded files (resumes)
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save resumes inside 'uploads/' folder
     // 'cb' means callback; we pass null as the first argument (no error) 'uploads/' as destination)
  },

  // ✅ 'filename' defines the saved filename of uploaded resume
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    // Example: 1712406593794-resume.pdf
    cb(null, uniqueName);// Save the file with unique timestamp
  },
});





/* ----------------- ONLY ALLOW PDF FILES ----------------- */

// 📍 2. Only allow PDF files using a filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only PDF files are allowed!"), false); // Reject other types
  }
};

/* ------------------------- INITIALIZE MULTER ---------------------------- */

// 📍 3. Set up multer with storage and filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});




/* ------------------------- POST /api/apply ---------------------------- */

// 📬 This route handles application form submission
router.post("/apply", upload.single("resume"), async (req, res) => {
  // 📤 'upload.single("resume")' means we expect a single file field named 'resume'

  try {
    // 🧾 Extract text fields from form data
    const {
      fullName,
      email,
      phone,
      skills,
      experience,
      education,
    } = req.body;
    const resumePath = req.file?.path;

    let resumeText = "";

      if (resumePath) {
        // Read file as buffer
        const pdfBuffer = fs.readFileSync(resumePath);

        // Extract text using pdf-parse
        const data = await pdfParse(pdfBuffer);
        resumeText = data.text; // This is the plain text from the resume PDF
        console.log("📄 Extracted Resume Text:\n", resumeText.slice(0, 300)); // Show only first 300 chars
      }

const { matchedSkills, matchScore } = matchSkills(resumeText, desiredSkills);

      // Save to DB
      const newApplication = new Application({
        fullName,
        email,
        phone,
        skills: req.body.skills, // ← this should be a string like "JavaScript, React"

        experience,
        education,
        resumePath: req.file.filename, // cleaner

        extractedText: resumeText, // Save full extracted text
        resumeText, // 🆕 Save extracted text

        matchedSkills,
  matchScore,
      });

    // 💾 Save the application to the MongoDB database
    await newApplication.save();

    // ✅ Send success response
    res.status(200).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("❌ Error in /apply route:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});


/* ------------------- GET /api/applications -------------------- */
// 📥 This route is for Admin to view applications
// 🔍 Route to fetch all applications with optional filters
router.get("/applications", async (req, res) => {
  try {
    const { skills, minExperience, education } = req.query;

    // 🧠 Build filter object based on optional query parameters
    const filters = {};

    if (skills) {
      // Convert comma-separated skill string to regex pattern
      const skillArray = skills.split(",").map(skill => skill.trim());
      filters.skills = { $regex: skillArray.join("|"), $options: "i" };
    }

    if (minExperience) {
      filters.experience = { $gte: parseInt(minExperience) };
    }

    if (education) {
      filters.education = { $regex: education, $options: "i" };
    }

    // 📄 Fetch applications from DB using filters and sort by latest
    const applications = await Application.find(filters).sort({ createdAt: -1 }); //Fetch data from MongoDB using filter object
//Sort newest application first

    res.json(applications); // ✅ Send filtered applications to frontend
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});




module.exports = router;


/*
🧠 What is cb?
- It stands for callback.
- Multer calls this internally to complete the operation.
- `cb(null, value)` means: no error, proceed with `value`.

Concept	Meaning
cb(null, value)	Callback to continue multer’s internal operation
new mongoose.Schema()	Defines the structure of MongoDB documents
default: Date.now	Automatically sets the creation date of a record
multer.diskStorage()	Tells multer where/how to save uploaded files
upload.single("resume")	Accepts one file named resume from the form


*/