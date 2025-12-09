const jwt = require("jsonwebtoken");
const User = require("../models/User");

// grab secret and expiration from env
// token stores user id so they stay logged in
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiresIn = "2h";

// gets ALL users
async function getAllUsers(req, res) {
  // console.log(req.headers);
  console.log(req.user);

  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to see this!" });
  }
  const user = await User.find();
  res.json(user);
}

// grabs user by id
function getUserById(req, res) {
  res.send(`Data for user: ${req.params.id}`);
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // basic check, user must send both email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "you must enter email and password" });
    }

    // try to find user by email
    // if no user found, we return same error to avoid giving hints
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // compare password using helper on user model
    // if password does not match we return same message for security
    const passwordOk = await user.isCorrectPassword(password);
    if (!passwordOk) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // create the token payload
    // store small info so frontend knows who is logged in
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // sign token so user can stay logged in
    const token = jwt.sign(payload, jwtSecret, {
      // grab expiration time from var
      expiresIn: tokenExpiresIn,
    });

    // send token and basic user data but not the passwrd
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // server error, something unexpected happened
    res.status(500).json({ message: "server error during login" });
  }
}
