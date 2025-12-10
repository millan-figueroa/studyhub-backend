const express = require("express");
const {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
} = require("../controllers/userController");

const auth = require("../middleware/auth");

const router = express.Router();

// register new user
// public route
router.post("/register", registerUser);

// login existing user
// public route
router.post("/login", loginUser);

// get all users
// this should prob be protected
router.get("/", auth, getAllUsers);

// get user by id
// protected as well
router.get("/:id", auth, getUserById);

module.exports = router;
