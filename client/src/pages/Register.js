//client/src/pages/Register.js ->handles user signup
//These files don’t store data – they only collect and send data from the user.

import React, { useState,useEffect  } from "react";
import axios from "axios";  // For making API requests
import BASE_URL from "../api"; // 👈 Import base URL for API

const Register = () => {
  // 🔐 Form fields using state (to store values entered by user)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker", // default role
  });

   // ✅ Clear form when component loads
   useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "seeker",
    });
  }, []);


  //  handleChange: updates state as user types (controlled components using props)
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
       [e.target.name]: e.target.value
      }));
    };

  // handleSubmit: sends form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, formData);//  Send data to backend

      alert(res.data.message); // Show success/failure
    } catch (err) {

      alert(err.response?.data?.message || "Registration failed");   //  Show error if failed
    }
  };

  return (
<div className="register-container">
  <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
    <h2>Create an Account</h2>

    <input
      type="text"
      name="name"
      placeholder="Full Name"
      autoComplete="off"
      value={formData.name}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />

    <input
      type="password"
      name="password"
      placeholder="Password"
      autoComplete="new-password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <select name="role" value={formData.role} onChange={handleChange}>
      <option value="seeker">Job Seeker</option>
      <option value="employer">Employer</option>
    </select>

    <button type="submit">Register</button>
  </form>
</div>

  )}
export default Register;


/*
🧠 Think of it like this:
Events = triggers (What happened)

Hooks = state/tools (What to store/change)

An event is any interaction the user does with the webpage that the app listens to and reacts to.

✅ Examples of events:

Typing in a form field 👉 onChange

Clicking a button 👉 onClick

Submitting a form 👉 onSubmit

Hovering your mouse 👉 onMouseOver

Pressing a key 👉 onKeyDown

onChange	Event that runs when an input changes (used to update state)


useState()	React hook to store component data,To store and update data inside a component (like form values)(like form input values)

useEffect	To run code when a component mounts, updates, or unmounts
useRef, useContext, etc.	Other useful hooks for different purposes


async	Makes the function asynchronous so we can await API call

await axios.post()	Waits for the backend to respond to our POST request

res	The response object from backend — it contains data, message, etc.

alert()	Shows a popup message on the screen (used for quick success/error msg)

formData	Variable that holds current values of the form (name, email, etc.)

setFormData()	Function that updates formData when user types something /Changes the state in real time

(e) in handleChange	e means "event object" — it holds details about the input event

handleChange is not an event or a hook.
It is a custom function (that you write) which gets triggered by an event (like onChange).

e.target.name →  gets the name of the input (name, email, password, etc.),	Refers to the name of the input being changed (like email)

e.target.value	→ gets what the user typed/Refers to the value typed into that input
*/
