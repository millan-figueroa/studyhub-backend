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
// this version uses simple callbacks so next is always a real function
UserSchema.pre("save", function (next) {
  const user = this;

  // if password hasn't changed, skip hashing to prevent double-hashing
  if (!user.isModified("password")) {
    return next();
  }

  // make the salt and hash the password
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // replace plain password with hashed version
      user.password = hash;
      // next();
    });
  });
});

// helper method to login, compares password to stored hash
// note: name matches what you use in loginUser: user.isCorrectPassword(...)
UserSchema.pre("save", async function () {
  // if password hasn't changed, skip hashing to prevent double-hashing
  if (!this.isModified("password")) {
    return;
  }

  // make the salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
