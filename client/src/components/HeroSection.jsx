import React from "react";
import animationData from "../assets/ai-assistant.json";
import Lottie from "lottie-react";
import "../App.css"
// src/components/HeroSection.jsx
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="text-content">
          <h1 className="hero-title">
            Revolutionize Your Hiring with <span>AI</span>
          </h1>
          <p className="hero-subtitle">
            Smart Resume Screening that saves your time & hires the right talent.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>

        <div className="lottie-wrapper">
      <Lottie animationData={animationData} loop={true} />
    </div>
      </div>
    </section>
  );
};

export default HeroSection;
