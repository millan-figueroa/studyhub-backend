const express = require("express");
const {
  getTasksForModule,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// >>> GET all tasks for one module <<<
// needs a valid token and a module id in the url
router.get("/modules/:moduleId/tasks", auth, getTasksForModule);

// >>> CREATE a new task for a module <<<
// also needs a valid token and module id
router.post("/modules/:moduleId/tasks", auth, createTask);

// >>> UPDATE a single task by id <<<
// user must own the parent module
router.put("/tasks/:taskId", auth, updateTask);

// >>> DELETE a single task by id <<<
// user must own the parent module
router.delete("/tasks/:taskId", auth, deleteTask);

module.exports = router;
