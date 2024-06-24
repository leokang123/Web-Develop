import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import session from "express-session";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "6256",
  port: 5432,
});
db.connect();

app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries v WHERE  v.user_id = $1", [currentUserId]);
  users = (await db.query("SELECT * FROM users")).rows;
  console.log(users);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  const error = req.session.error;
  req.session.error = null; // 에러 메시지를 한 번만 보여주고 삭제
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: users.find(p => p.id === currentUserId).color,
    error: error 
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT * FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
    const data = result.rows.find(p => p.country_name.length === input.length);
    const country = data? data : result.rows[0];
    console.log(country);
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [country.country_code, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      req.session.error = `${country.country_name} has already been added, try again.`;
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    req.session.error = "Country name does not exist, try again.";
    res.redirect("/");
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add === 'new') return res.render("new.ejs");
  currentUserId = parseInt(req.body.user);
  console.log("current User: " + currentUserId);
  res.redirect("/");
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  console.log(req.body);
  const result = await db.query(
    "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *",
    [req.body.name, req.body.color]
  );
  const id = result.rows[0].id;
  currentUserId = id;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
