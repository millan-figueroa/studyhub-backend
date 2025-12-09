const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  // first checks if var exists
  if (!MONGO_URI) {
    console.error(
      "Missing MONGO_URI. Set it in .env (locally) or in Render env vars."
    );
    // kills the backend (prevents app from running if broken)
    process.exit(1);
  }

  // begins try/catch block to attempt to connect to db
  try {
    // uses mongoose to connect with uri. await pauses func until mongo connects
    await mongoose.connect(MONGO_URI);
    console.log("🍻 MongoDB connected");
    // if fails, jumpt to catch
  } catch (err) {
    console.error("⚰️ Mongo connection error:", err);
    // exts if attempt fail
    process.exit(1);
  }
};

module.exports = connectDB;
