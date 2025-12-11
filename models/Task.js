const mongoose = require("mongoose");

// task schema will store each study task that belongs to a module
// task is like assignment, reading, todo item

const taskSchema = new mongoose.Schema(
  {
    // short title or name of the task, required so user must enter it
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // optional longer description about what the task is
    description: {
      type: String,
      trim: true,
    },

    // status to track progress, we keep it simple with 3 choices
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "To Do",
    },

    // this links the task to the module it belongs to
    // required so no task exsts without a module
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
  },
  {
    // this just auto saves timestamps like created and updated
    timestamps: true,
  }
);

// export so we can use it in other files
module.exports = mongoose.model("Task", taskSchema);
