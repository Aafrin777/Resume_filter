// client/src/pages/ApplicationForm.js
import Lottie from "lottie-react";
import animationData from "../assets/job-apply.json"; // your animation file
import React, { useState } from "react";
import axios from "axios"; // To make HTTP requests
import { useNavigate } from "react-router-dom"; // For page redirection

const ApplicationForm = () => {
  // 🧠 useState to manage form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: localStorage.getItem("userEmail") || "", // Pre-fill from localStorage
    phone: "",
    skills: "",
    experience: "",
    education: "",
    resume: null, // To store the uploaded file
  });

  const navigate = useNavigate(); // For redirecting after form submission

  // 🔁 Handle input change for all text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field
    }));
  };

  // 📎 Handle file input (PDF Resume Upload)
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      resume: e.target.files[0], // Store the selected file
    }));
  };

  // 📨 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // 👇 Prepare data using FormData (for file + text together)
    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/apply",
        formDataToSubmit,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.message === "Application submitted successfully.") {
        alert(res.data.message);
        navigate("/"); // Redirect after successful application
      } else {
        alert("Error submitting application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (

<div className="application-form-container">
<div className="form-animation">
    <Lottie animationData={animationData} loop />
  </div>
  <div className="form-card">

    <h2>Job Application</h2>
    <form onSubmit={handleSubmit}>

        {/* 👤 Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* 📧 Email (Pre-filled & disabled) */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          // required
          // disabled
        />
        <br /><br />

        {/* 📞 Phone Number */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* 🧠 Skills */}
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* 🏢 Experience */}
        <input
          type="number"
          name="experience"
          placeholder="Experience (in years)"
          value={formData.experience}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* 🎓 Education */}
        <input
          type="text"
          name="education"
          placeholder="Highest Education"
          value={formData.education}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* 📄 Resume Upload */}
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <br /><br />

        {/* ✅ Submit Button */}
        <button type="submit">Submit Application</button>


      </form>
    </div>
    </div>
  );
};


export default ApplicationForm;




/*
useState() → to manage form input values (including the file)


handleChange(e) → updates text fields using setFormData

handleFileChange(e) → handles PDF resume file upload

FormData() → used to send both text + files to backend

axios.post() → sends form data to the backend route

navigate() → redirects user to another page after success

alert() → shows messages from backend

onChange / onSubmit → events triggered on user actions

*/