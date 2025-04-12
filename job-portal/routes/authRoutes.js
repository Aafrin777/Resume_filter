/*=========================================
 📁 routes/authRoutes.js
Routes (Node.js + Express)

Handles the URL path (like /register, /login) and defines what should happen when certain URLs are hit:

It connects the URLs like /api/auth/login and /api/auth/register to functions that handle them — those functions live in authController.js.

 [Holds /register and /login route paths]
 =========================================*/

// Import required packages
const express = require("express");
const router = express.Router(); // Create an Express Router

// Import controller functions to handle (register & login)
const { register, login } = require("../controllers/authController");

// ============================================
// ✅ REGISTER ROUTE - Register New User
// ============================================
// @route   POST /api/auth/register
// @desc    Registers a new user
// @access  Public (no authentication needed)

router.post("/register", register);// Calls the register function from controller

// ========================================
// ✅ LOGIN ROUTE - User Login
// ========================================
// @route   POST /api/auth/login
// @desc    Logs in user and returns token
// @access  Public (no authentication needed)

router.post("/login", login);  // Calls the login function from controller

// Export the router so it can be used in server.js
module.exports = router;


/*


📝 @desc — This is the description of what the route does.

In this case, it registers a new user by saving their info (like name, email, password) in the database.

- 🔐 **`@access`** — This tells whether the route requires **authentication or not**.
- `Public` means **anyone** can access this route (no login token required).
- If it were `Private`, it would mean the user must be **logged in and provide a token** to access it.

---

### ✅ Summary:
| Line               | Meaning                                                                 |
|--------------------|-------------------------------------------------------------------------|
| `@route`           | HTTP method + path (where the route is hit)                             |
| `@desc`            | Description of what the route does                                       |
| `@access`          | Who can access it — public (no login) or private (login/token required) |



*/