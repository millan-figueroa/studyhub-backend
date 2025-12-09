const mongoose = require("mongoose"); // defines schema/ model
const bcrypt = require("bcryptjs"); // safely hash passwrds before storing them

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, //automaticlly removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // more reasonable min
    },
    role: {
      // allows diffeernt users to have different permissions (create/modify module)
      type: String,
      enum: ["admin", "student"],
      default: "student", // most users will be students
    },
  },
  {
    timestamps: true, // to help keep track of stuff (join, modify info, upload tasks)
  }
);

// hash password before saving
UserSchema.pre("save", async function (next) {
  // if password hasn't changed, skip hashing to prevent double-hashing
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// helper method to login, compares password to stored hash
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
