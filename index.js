const express = require("express");
const app = express();
const port = 3300;
const dbUrl =
  "mongodb+srv://wholesome-gee:wlfyd1564@freecluster.0ds7963.mongodb.net/?retryWrites=true&w=majority&appName=FreeCluster";

const mongoose = require("mongoose");
mongoose
  .connect(dbUrl)
  .then((res) => console.log("✅ db 연결"))
  .catch((err) => console.log("❌ db 연결 실패: ", err));
app.get("/", (req, res) => res.send("main 페이지"));

app.listen(port, () => console.log(`✅ server on : http://localhost:${port}`));
