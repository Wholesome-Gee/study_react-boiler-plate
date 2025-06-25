const express = require("express");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { authMiddleware } = require("./middlewares/authMiddleware");
const config = require("./config/key"); // 환경변수 설정
const port = 3300;
const app = express();

// mongodb와 연결
const dbUrl = config.mongoURI;
const mongoose = require("mongoose");
mongoose
  .connect(dbUrl)
  .then((res) => console.log("✅ db 연결"))
  .catch((err) => console.log("❌ db 연결 실패: ", err));

// use 전역요청
app.use(express.urlencoded({ extended: true })); // req.body를 사용하기 위한 설정1
app.use(express.json()); // req.body를 사용하기 위한 설정2
app.use(cookieParser()); // cookie에 token을 담기 위한 설정

// get 요청
app.get("/", (req, res) => res.send("main 페이지"));
app.get("/auth", authMiddleware, (req, res) => {
  // login한 유저인지, admin인지 인증하는 route
  res.status(200).json({
    _id: req.user._id,
    isManager: req.user.manager,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    manager: req.user.manager,
    image: req.user.image,
  });
});
app.get("/logout", authMiddleware, async (req, res) => {
  //
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    res.status(200).send({ logoutSuccess: true, message: "⭕ 로그아웃 되었습니다." });
  } catch (err) {
    res.json({ loginSuccess: false, message: `❌ 로그아웃 실패: ${err}` });
  }
});

// post 요청
app.post("/join", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.json({ success: true, message: `⭕ 가입이 완료되었습니다.` });
  } catch (err) {
    return res.json({ success: false, message: `❌ 가입실패: ${err}` });
  }
});

app.post("/login", async (req, res) => {
  try {
    // step1. req.body.email이 db에 있는지
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ loginSuccess: false, message: `가입되지 않은 email입니다.` });
    }
    // step2. req.body.password가 user의 password와 일치하는지
    const isMatch = await user.comparePW(req.body.password); // User.js에 userShema.methods.comparePW 만들기
    if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
    // step3. cookie에 token을 부여
    const token = await user.createToken();
    user.token = token;
    await user.save();
    return res.cookie("userToken", user.token).status(200).json({ loginSuccess: true, message: "로그인 성공" });
  } catch (err) {
    return res.json({ loginSuccess: false, message: `server Error ${err}` });
  }
});

app.listen(port, () => console.log(`✅ server on : http://localhost:${port}`));
