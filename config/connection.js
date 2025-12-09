const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error(
      "Missing MONGO_URI. Set it in .env (locally) or in Render env vars."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("Mongo connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
