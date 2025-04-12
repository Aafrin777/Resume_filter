//Login.js – handles user login
//These files don’t store data – they only collect and send data from the user.
// ✅ Import necessary modules

import React, { useState, useEffect } from "react";
import axios from "axios";// For making API requests
import { useNavigate } from "react-router-dom"; // to use nevigate
import { Player } from "@lottiefiles/react-lottie-player";
import cycleGirl from "../assets/cycle.json"; // ✅ Your animation
import "../App.css";

const Login = () => {
  // ✅ Create state to manage login form fields store/change
  // useState hook to store form input values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

 // ✅ Clear form when component loads
 useEffect(() => {
  setFormData({
    email: "",
    password: "",
  });
}, []);

const handleChange = (e) => {
    // ✅ Handle input change (email, password)/ Update state as user types
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

  const navigate = useNavigate();


// Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

        // Check before sending
        if (!formData.email || !formData.password) {
          alert("Both fields are required");
          return;
        }
        console.log("📤 Sending login data:", {
          email: formData.email,
          password: formData.password,
        });

    try {
      const res = await axios.post(   //On form submit, you send data to backend using
        "http://localhost:5000/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Login response:", res.data);

      if (res.data.message === "Login successful.") {
        // Store user info in localStorage (You can also store token later if backend sends one)
        localStorage.setItem("userEmail", formData.email);

        alert(res.data.message);
        navigate("/"); // Redirect to Home page after successful login
      } else {
        alert(res.data.message); // Show error message
      }
    } catch (error) {
      console.error("Login Error:", error);

      alert("An error occurred during login maybe you did not register.");
    }
  };

  return (

    <div className="login-container">
  <div className="background-animation">
    {/* ✅ Lottie background */}
    <Player
      autoplay
      loop
      src={cycleGirl}
     className="background-animation"
    />  </div>

    {/* ✅ Login Form Container */}

 <div className="login-form">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br /><br />

{/* Password Field */}
  <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br /><br />

   {/* Submit Button */}
  <button type="submit">Login</button>
        </form>
      </div>
    </div>

  );
};

export default Login;

/*
useState() → React hook to manage form input values (email & password)

formData → Object holding the current form values

setFormData() → Function to update the state (formData)
handleChange()→ updates the state using setFormData
handleChange(e) → A function triggered by onChange event on inputs

e.target.name → Gets the input field's name (email, password)

e.target.value → Gets the typed value from the input

handleSubmit(e) → Runs when the form is submitted (onSubmit)

e.preventDefault() → Stops the page from refreshing

axios.post() → Sends the login data to your backend

res.data.message → Reads the message sent back from backend

alert() → Displays the login success/failure message

onSubmit — event triggered when form is submitted

async/await — waits for backend response
*/