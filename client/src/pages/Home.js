import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem("userEmail");

    if (email) {
      setUserEmail(email);
    } else {
      // If no email found, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); // Clear login info
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome to the Job Portal</h2>
      <p>Logged in as: <strong>{userEmail}</strong></p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
