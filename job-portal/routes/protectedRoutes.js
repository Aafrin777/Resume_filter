/* routes/protectedRoutes.js

//✅ Routes that require login to access and The route will only work if authMiddleware says you're authenticated
Only logged-in users can access this route
*/

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// @route   GET /api/protected/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile!",
    user: req.user, // Comes from middleware
  });
});

module.exports = router;



/*
✅ What it does:
These are backend routes (like /dashboard, /my-jobs, etc.) that only logged-in users can use.

To protect them, we add the authMiddleware to the route.

🧠 Think of it like:
“Rooms in a building that only authorized people can enter. The guard (middleware) checks you before opening the door.”

🧑 (Frontend) —> makes request to /dashboard (protected route)
             |
             ↓
🔐 (authMiddleware.js) —> Checks the token in header
             |
             ↓
✅ If valid, attaches user info to request
             |
             ↓
🛠 (protectedRoutes.js) —> Now runs the actual route logic with logged-in user

*/