const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // who owns/created this module (usually an admin)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // timestamps to tell you when stuff was created
    timestamps: true,
  }
);

module.exports = mongoose.model("Module", ModuleSchema);
