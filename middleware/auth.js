const jwt = require("jsonwebtoken");

// using our env secret and expiration time
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiresIn = "2h";

// >>> AUTH middleware <<<
// this checks for a token in headers, body, or query
// if token is valid we attach small user info to req.user
// if not valid we block request
function auth(req, res, next) {
  console.log("auth middleware hit on:", req.method, req.originalUrl);
  // token could come in different places
  let token = req.body?.token || req.query?.token || req.headers?.authorization;

  // if token came from header it looks like "bearer blahblah"
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  // if no token, user is not allowed to do protected stuff
  if (!token) {
    return res.status(401).json({ message: "Pls login first" });
  }

  try {
    // verify token with same secret we used to sign it
    const decoded = jwt.verify(token, jwtSecret, {
      expiresIn: tokenExpiresIn,
    });

    // attach user data to request
    // has id, name, email, role (no password)
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "invalid token, login again" });
  }

  // pass control to actual route
  next();
}

// >>> ADMIN ONLY middleware <<<
// this checks if the logged in user has admin role
// blocks route if not admin
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    console.log(req.user);
    return next();
  }
  return res.status(403).json({ message: "admin only area" });
}

// >>> SIGN TOKEN helper <<<
// used when logging in or registering
function signToken(user) {
  const payload = {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: tokenExpiresIn,
  });
}

module.exports = {
  auth,
  adminOnly,
  signToken,
};
