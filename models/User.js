const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, function (err, salt) {
      console.log("salt란?", salt);
      // 10번 해싱하는 salt를 만든다.
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        // user.password를 salt로 해싱하고, 그 값을 hash에 담는다.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// password와 해싱된 password가 일치한지 비교하는 method
userSchema.methods.comparePW = function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const User = mongoose.model("User", userSchema); // db에 users collection이 생성됨

module.exports = { User }; // export
