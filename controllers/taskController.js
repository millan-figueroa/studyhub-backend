const Task = require("../models/Task");
const Module = require("../models/Module");

// >>> GET ALL tasks for one module <<<
// user must own the module or cant see tasks
async function getTasksForModule(req, res) {
  try {
    const moduleId = req.params.moduleId;

    // find module but make sure it belongs to logged in user
    const mod = await Module.findOne({
      _id: moduleId,
      owner: req.user.id,
    });

    if (!mod) {
      return res.status(404).json({ message: "module not found" });
    }

    // now get tasks that belong to that module
    const tasks = await Task.find({ module: moduleId }).sort("createdAt");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "server error getting tasks" });
  }
}

// >>> CREATE new task for a module <<<
// user must own the module or cant create tasks
async function createTask(req, res) {
  try {
    const moduleId = req.params.moduleId;
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const mod = await Module.findOne({
      _id: moduleId,
      owner: req.user.id,
    });

    if (!mod) {
      return res.status(404).json({ message: "module not found" });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      module: moduleId,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "server error creating task" });
  }
}

// >>> UPDATE existing task <<<
// user must own the module where the task lives
async function updateTask(req, res) {
  try {
    const taskId = req.params.taskId;
    const { title, description, status } = req.body;

    // find the task itself first
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    // now find the module it belongs to and check ownership
    const mod = await Module.findOne({
      _id: task.module,
      owner: req.user.id,
    });

    if (!mod) {
      return res
        .status(403)
        .json({ message: "not authorized to edit this task" });
    }

    // update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "server error updating task" });
  }
}

// >>> DELETE existing task <<<
// user must own the module where the task lives
async function deleteTask(req, res) {
  try {
    const taskId = req.params.taskId;

    // find the task first
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    // verify ownership by checking module owner
    const mod = await Module.findOne({
      _id: task.module,
      owner: req.user.id,
    });

    if (!mod) {
      return res
        .status(403)
        .json({ message: "not authorized to delete this task" });
    }

    await task.deleteOne();

    res.json({ message: "task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "server error deleting task" });
  }
}

module.exports = {
  getTasksForModule,
  createTask,
  updateTask,
  deleteTask,
};
