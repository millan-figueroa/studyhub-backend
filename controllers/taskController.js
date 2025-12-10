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

    // verify the module belongs to this user
    const mod = await Module.findOne({
      _id: moduleId,
      owner: req.user.id,
    });

    if (!mod) {
      return res.status(404).json({ message: "module not found" });
    }

    // create new task tied to the module
    const newTask = await Task.create({
      title,
      description,
      status,
      module: moduleId,
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "server error creating task" });
  }
}
