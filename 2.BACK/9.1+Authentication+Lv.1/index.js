import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "6256",
  port: 5432
});

db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const passwd = req.body.password;
  try {
    const checkResults = await db.query("SELECT * FROM users WHERE email = $1",[username]);
    if (checkResults.rows.length > 0) {
      res.send("Email already exists. Try logging in");
    } else {
      const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [username, passwd]);
      console.log(result);
      res.render("secrets.ejs");
  
    }
  } catch (err) {
    console.log(err);
  }
});


app.post("/login", async (req, res) => {
  const username = req.body.username;
  const passwd = req.body.password;
  console.log(username, passwd);
  try{
    const result = await db.query("SELECT password FROM users WHERE email = $1", [username]);
    if (result.rows.length > 0) {
      const password = result.rows[0].password;
      if (password == passwd) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");

    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
