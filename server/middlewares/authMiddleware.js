const { User } = require("../models/User");

const authMiddleware = async (req, res, next) => {
  // 1. 클라이언트 쿠키에서 토큰을 가져온다.
  const userToken = req.cookies.userToken;
  if (!userToken) {
    return res.json({ isAuth: false, error: true, message: "토큰이 없습니다." });
  }
  try {
    const user = await User.findByToken(userToken);
    if (!user) {
      return res.json({ isAuth: false, error: true, message: "토큰과 일치하는 유저가 없습니다." });
    }
    req.token = userToken;
    req.user = user;
    next();
  } catch (err) {
    return res.json({ isAuth: false, error: true, message: "인증에 실패하였습니다." });
  }
  // 2. 토큰을 decode해서 user를 찾는다.
  // 3. 유저가 있으면 인증 ok
  // 4. 유저가 없으면 인증 no
};

module.exports = { authMiddleware };
