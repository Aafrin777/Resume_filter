import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ApplicationForm from "./pages/ApplicationForm";
import AllApplications from "./pages/AllApplications";
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';

const App = () => {
  return (
    <>


      <Navbar />
      <Routes>

        <Route path="/" element={<HeroSection />} />
        <Route path="/apply" element={<ApplicationForm />} />
{/* apply for application foam file and applications for resumedata mean Allapplications page */}
        <Route path="/applications" element={<AllApplications />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          </Routes>
        </>
  );
};

export default App;



/*

React (Login.js) → axios →
   Express (authRoutes.js) →
     Logic (authController.js) →
       Database (User.js & MongoDB)

react-router-dom → library for routing in React
If route is protected:
React → axios → protectedRoutes.js → authMiddleware.js → continue only if token is valid

<BrowserRouter> → wraps the app to enable routing

<Link> → used instead of anchor tag (<a>) to switch pages without reloading

<Routes> → contains all your different <Route> pages

path="/register" → URL to open Register page

element={<Register />} → Component to show when that path is active

react-router-dom — for client-side navigation

<Link> — to move between pages without page reload

<Route> — tells React which component to show based on URL

<Routes> — holds all the route configs
*/