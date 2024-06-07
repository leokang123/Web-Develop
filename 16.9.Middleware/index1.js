import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

// 이코드를 쓰면 req이 body를 가지게 된다 ( 안쓰면 req의 body가 불분명해짐 )
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/submit", (req, res) => {
  console.log(req.body);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
