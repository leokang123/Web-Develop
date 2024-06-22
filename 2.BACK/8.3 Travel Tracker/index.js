import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "6256",
  port: 5432
})
const app = express();
const port = 3000;

db.connect();
const connective = ["and", "of", "for", "their"];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((p) => countries.push(p.country_code));
  let total_countries = countries.length;
  console.log(result.rows);
  res.render("index.ejs", {
    total: total_countries,
    countries: countries,
  });
});

app.post("/add", async (req, res) => {
  const target = req.body.country;
  // const target2 = req.body.country.split(' ');
  // const target = target2.map(p => 
  //   connective.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
  // ).join(' ');
  // let target = "";
  // target2.forEach(p => {
  //   if (connective.includes(p)) {
  //     target += p
  //   } else {
  //     target += p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  //   }
  //   target += ' ';
  // })
  // target = target.trim();

  console.log(target);
  try {
    const country_code = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) = % || $1 || %", [target.toLowerCase()]);
    if (country_code.rows.length > 0) {
      const code = country_code.rows[0];
      console.log (code);
      // DB 내부적으로 무시하는 코드 
      // db.query("INSERT INTO visited_countries (country_code) VALUES ($1) ON CONFLICT (country_code) DO NOTHING", [code.country_code]);

      // 에러나면 백에서 처리하는 코드 
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [code.country_code]);
      res.redirect("/");
    } else {
      res.send(
        `<script>
          alert('Wrong Input');
          location.href='/';
        </script>`
      );
    }
  } catch(e) {
    if (e.code == '23505') {
      res.status(409).send(`<script>alert('Country is already visited'); location.href='/'; </script>`)
    } else {
      res.status(500).send(`<script>alert('An unexpected error occurred'); location.href='/'; </script>`)
    }
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
