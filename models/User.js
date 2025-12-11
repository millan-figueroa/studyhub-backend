const mongoose = require("mongoose"); // defines schema/ model
const bcrypt = require("bcryptjs"); // safely hash passwrds before storing them

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["admin", "user"], // only these 2 are allowed
      default: "user", // most users will be users
    },
  },
  {
    // adds createdAt and updatedAt automaticaly
    timestamps: true, // to help keep track of stuff (join, modify info, upload tasks)
  }
);

// hash password before saving
userSchema.pre("save", async function (next) {
  // only hash if password is new or changed
  if (this.isNew || this.isModified("password")) {
    // generate salt rounds and hash password
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

// helper method to login, compares password to stored hash
// note: name matches what you use in loginUser: user.isCorrectPassword(...)
// helper method to login, compares password to stored hash
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
