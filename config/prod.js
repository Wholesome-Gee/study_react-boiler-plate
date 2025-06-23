// 배포환경에서 환경변수를 MONGO_URI로 등록해줘야 한다.
module.exports = {
  mongoURI: process.env.MONGO_URI,
  // mongoDB 접속 url작성
};
