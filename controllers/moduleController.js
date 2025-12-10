const Module = require("../models/Module");
const Task = require("../models/Task");

// >>> GET ALL modules for logged in user <<<
// only returns modules where owner matches the user from the token
async function getModules(req, res) {
  try {
    // make sure we actually have a user from auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "pls login first" });
    }

    // find all modules owned by this user sort by date
    const modules = await Module.find({ owner: req.user.id }).sort(
      "-createdAt"
    );

    res.json(modules);
  } catch (err) {
    // basic server error
    res.status(500).json({ message: "server error getting modules" });
  }
}

// >>> GET single module by id <<<
// makes sure the module belongs to the logged in user
async function getModuleById(req, res) {
  try {
    const moduleId = req.params.id;

    // find module that matches id and ownner
    // findById will give you the module regardless of owner so i used findOne here  because only authorized users can see modules
    const mod = await Module.findOne({
      _id: moduleId,
      owner: req.user.id,
    });

    if (!mod) {
      return res.status(404).json({ message: "module not found" });
    }

    res.json(mod);
  } catch (err) {
    res.status(500).json({ message: "server error getting module" });
  }
}

// >>> CREATE new module <<<
// user can create a module with title and description
async function createModule(req, res) {
  try {
    const { title, description } = req.body;

    // title is required so we do a quick check
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    // create module owned by the logged in user
    const newModule = await Module.create({
      title,
      description,
      owner: req.user.id,
    });

    res.status(201).json(newModule);
  } catch (err) {
    res.status(500).json({ message: "server error creating module" });
  }
}

// >>> UPDATE existing module <<<
// only owner of module can update it
async function updateModule(req, res) {
  try {
    const moduleId = req.params.id;
    const { title, description } = req.body;

    // find module owned by the current user
    const mod = await Module.findOne({
      _id: moduleId,
      owner: req.user.id, // authorization check
    });

    if (!mod) {
      return res.status(404).json({ message: "module not found" });
    }

    // update fields if they were sent
    if (title !== undefined) {
      mod.title = title;
    }
    if (description !== undefined) {
      mod.description = description;
    }

    const updated = await mod.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "server error updating module" });
  }
}

// >>> DELETE module <<<
// only owner can delete, and we also clean up tasks for that module
async function deleteModule(req, res) {
  try {
    const moduleId = req.params.id;

    // find module owned by the user
    const mod = await Module.findOne({
      _id: moduleId,
      owner: req.user.id,
    });

    if (!mod) {
      return res.status(404).json({ message: "module not found" });
    }

    // delete all tasks tied to this module so they dont just sit there
    await Task.deleteMany({ module: mod._id });

    // delete the module itself
    await mod.deleteOne();

    res.json({ message: "module and tasks deleted" });
  } catch (err) {
    res.status(500).json({ message: "server error deleting module" });
  }
}

module.exports = {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
};
