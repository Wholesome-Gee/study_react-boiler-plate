const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, maxlength: 16 },
  email: { type: String, trim: true, unique: true },
  pasword: { type: String, minlength: 4 },
  manager: { type: Boolean, default: false },
  image: String,
  token: { type: String },
  tokenExp: { type: Number },
});

const User = mongoose.model("User", userSchema); // db에 users collection이 생성됨

module.exports = { User }; // export
