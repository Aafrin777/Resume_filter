import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.svg";
import "../App.css"
const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
          <span>AI ResumeBot</span>
        </Link>

        {/* Hamburger Button */}
        <button className="hamburger" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links */}
        <ul className={`nav-links ${open ? "show" : ""}`}>
          <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
          
          <li><Link to="/apply" onClick={() => setOpen(false)}>Apply</Link></li>
          <li><Link to="/applications" onClick={() => setOpen(false)}>ResumeData</Link></li>

          <li className="auth-links">
            <Link
            to="/login"
             onClick={() => setOpen(false)}>Login 🔐
             </Link>

            <Link to="/register" className="register-btn" onClick={() => setOpen(false)}>Register</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
