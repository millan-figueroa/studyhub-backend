const express = require("express");
const {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// all module routes are protected, so we put auth on each

// >>> GET all modules for logged in user <<<
router.get("/", auth, getModules);

// >>> GET one module by id <<<
router.get("/:id", auth, getModuleById);

// >>> CREATE new module <<<
router.post("/", auth, createModule);

// >>> UPDATE module by id <<<
router.put("/:id", auth, updateModule);

// >>> DELETE module by id <<<
router.delete("/:id", auth, deleteModule);

module.exports = router;
