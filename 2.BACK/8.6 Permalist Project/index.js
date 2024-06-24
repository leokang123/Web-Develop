import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "6256",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  let item = req.body.newItem;
  if (item.length >= 100) {
    item = item.slice(0,100);
    console.log(item.length);
  }
  const result = await db.query("INSERT INTO items (title) VALUES ($1) RETURNING title", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = parseInt(req.body.updatedItemId);
  const title = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $2 WHERE id = $1",[id,title]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = parseInt(req.body.deleteItemId);
  await db.query("DELETE FROM items WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
