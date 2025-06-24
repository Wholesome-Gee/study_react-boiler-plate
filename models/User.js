const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// token을 만들어주는 method
userSchema.methods.createToken = function () {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), "tokenKey"); // user._id의 token이 생성되고 이 tokend의 key값은 tokenKey임
  return token;
};

// token으로 db에서 user를 찾는 method
userSchema.statics.findByToken = async function (userToken) {
  const user = this;
  try {
    const decodedUserId = jwt.verify(userToken, "tokenKey"); // encode된 userToken을 jwt.verify를 활용해 decode
    console.log(decodedUserId);

    const user = await user.findOne({ _id: decodedUserId, token: userToken });
    return user;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema); // db에 users collection이 생성됨

module.exports = { User }; // export
