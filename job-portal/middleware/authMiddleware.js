/* middleware/authMiddleware.js
//✅ Verifies token & grants access if it's valid
If you're using JWT tokens for protected routes:

This middleware checks if the user has a valid token.

If yes → let the request pass.

If not → reject access.
*/

const jwt = require("jsonwebtoken");
const User = require("../models/User");



const JWT_SECRET = "mysecretkey"; // We'll move to .env later

/**
 * Middleware to protect routes
 */
const protect = async (req, res, next) => {
  try {

    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // 2. Extract token (Bearer <token>)
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Attach user info to request (optional but useful)
    req.user = await User.findById(decoded.id).select("-password"); // Exclude password

    next(); // Proceed to route handler
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = protect;


/*
Checks for a token in the request.

Verifies it.

If valid → attaches user info to req.user and calls next() so the route continues.

If invalid or missing → denies access with an error.

🧠 Think of it like:
“The security guard at the gate — checking your visitor pass (token) before letting you in.”
*/