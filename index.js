const express = require("express");
const app = express();
const port = 3300;
const { User } = require("./models/User");

// mongodb와 연결
const dbUrl =
  "mongodb+srv://wholesome-gee:wlfyd1564@freecluster.0ds7963.mongodb.net/boiler-plate?retryWrites=true&w=majority&appName=FreeCluster/boiler-plate";
const mongoose = require("mongoose");
mongoose
  .connect(dbUrl)
  .then((res) => console.log("✅ db 연결"))
  .catch((err) => console.log("❌ db 연결 실패: ", err));

// use 전역요청
app.use(express.urlencoded({ extended: true })); // req.body를 사용하기 위한 설정1
app.use(express.json()); // req.body를 사용하기 위한 설정2

// get 요청
app.get("/", (req, res) => res.send("main 페이지"));

// post 요청
app.post("/join", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.json({ success: true, message: `⭕ 가입이 완료되었습니다.` });
  } catch (err) {
    console.log("❌ 가입실패: ", err);
    return res.json({ success: false, message: `❌ 가입실패: ${err}` });
  }
});

app.listen(port, () => console.log(`✅ server on : http://localhost:${port}`));
