const jwt = require("jsonwebtoken");
const User = require("../models/User");

// grab secret and expiration from env
// token stores user id so they stay logged in
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiresIn = "24h";

// >>> GETS ALL users <<<
async function getAllUsers(req, res) {
  // console.log(req.headers);
  console.log(req.user);

  if (!req.user) {
    return res
      .status(401)
      .json({ message: "🔐 You must be logged in to see this!" });
  }
  const user = await User.find();
  res.json(user);
}

// >>> GETS user by ID <<<
function getUserById(req, res) {
  res.send(`Data for user: ${req.params.id}`);
}

// >>> REGISTER the user <<<
async function registerUser(req, res) {
  try {
    // pull needed data from request body
    const { username, email, password } = req.body;
    console.log("hit registerUser route", req.body);

    // check for missing required fields (frontend validation lives in browser so we gotta check here as well)
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "🚨 Pls enter username, email, and password" });
    }

    // check database to see if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "💀 Email already exists" });
    }

    // create the new user document
    // we force role to user so folks cant make themself admin on signup
    // password will get hashed in user model before save
    const createdUser = await User.create({
      username,
      email,
      password,
      role: "user",
    });

    // send a clear success response
    // do not include password for safety reasons
    // make a token so user is logged in right after register
    const payload = {
      id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: tokenExpiresIn,
    });

    // send back token and user info (no password)
    res.status(201).json({
      message: "⭐ User created successfully ⭐",
      token,
      user: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (err) {
    console.log("💀 Error in registerUser:", err.message);
    res.status(500).json({ message: "💀 Server error creating user" });
  }
}

// >>> LOGIN USER <<<
// user login - checks email/pass, makes token if ok
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // basic check, user must send both email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "🚨 You must enter email and password" });
    }

    // try to find user by email
    const user = await User.findOne({ email });

    // debug log to see if we found the user
    console.log("login attempt:", email, "found user?", !!user);

    if (!user) {
      return res
        .status(400)
        .json({ message: "💀 Incorrect email or password" });
    }

    // compare password using helper on user model
    const passwordOk = await user.isCorrectPassword(password);
    if (!passwordOk) {
      return res
        .status(400)
        .json({ message: "💀 Incorrect email or password" });
    }

    // create the token payload
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // sign token so user can stay logged in
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: tokenExpiresIn,
    });

    // send token and basic user data but not the password
    res.status(200).json({
      message: "⭐ Login successful ⭐",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("login error:", err.message);
    res.status(500).json({ message: "❌ server error during login" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
};
