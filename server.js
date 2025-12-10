// dotenv loads environment variables from .env into process.env.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connection");

const app = express();

// Middleware ** expres is the core framwork, and cors allows the back to talk to the front
app.use(cors());
app.use(express.json());

// mounts user routes
const userRoutes = require("./routes/userRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const taskRoutes = require("./routes/taskRoutes");
// handle all user auth routes like register and login
app.use("/api/users", userRoutes);
// module routes
app.use("/api/modules", moduleRoutes);
// task routes (uses /api/modules/:moduleId/tasks and /api/tasks/:taskId)
app.use("/api", taskRoutes);
// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// get env vars
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// connect to MongoDB, then start server
const startServer = async () => {
  await connectDB(); // handles its own errors/exit if it fails

  app.listen(PORT, () => {
    console.log(`💎 Server running on port ${PORT}`);
  });
};

startServer();
