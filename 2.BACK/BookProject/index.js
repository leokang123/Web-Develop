import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = ""
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book",
    password: "6256",
    port: 5432
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/search", (req, res) => {
    const search = req.body.query;
    console.log(search);
    res.redirect('/book');
});

app.get("/", async (req, res) => {
    res.render("contact.ejs");
});
app.get("/book", async (req, res) => {
    // const result = await axios.get("https://openlibrary.org/search.json?title=harry+potter&limit=3");
    // result.data.docs.forEach(p=> console.log(p.title));
    // result.data.docs[0].isbn[0]
    const result = await db.query("SELECT * FROM mylist ORDER BY id ASC");
    const data = result.rows;
    console.log(data);
    res.render("index.ejs", {
        books: data
    });
});

app.get("/new", async (req, res) => {
    res.render("new.ejs");
});

app.post("/edit", async (req, res) => {
    const type = req.body.type;
    if (type === "delete") {
        console.log(type);
        res.redirect("/book");
    } else {
        console.log(type);
        res.redirect("/book");
    }
});

app.listen(port, () => {
    console.log("Listening to port number " + port);
});