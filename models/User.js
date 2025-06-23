const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10; // 해싱횟수

const userSchema = mongoose.Schema({
  name: { type: String, maxlength: 16 },
  email: { type: String, trim: true, unique: true },
  password: { type: String, minlength: 4 },
  manager: { type: Boolean, default: false },
  image: String,
  token: { type: String },
  tokenExp: { type: Number },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRound, function (err, salt) {
      // getSalt는 saltRound숫자만큼 해싱하는 소금을 생성하고, salt에 담는다.
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // 대상을 salt로 해싱하고, 그 값을 hash에 담는다.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema); // db에 users collection이 생성됨

module.exports = { User }; // export
