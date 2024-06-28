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
let book_cache = [];

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/search", async(req, res) => {
    book_cache = [];
    const search = req.body.query.trim().replaceAll(' ','+');
    console.log(search);
    const result = await axios.get(`https://openlibrary.org/search.json?title=${search}&fields=title,author_name,isbn,&limit=50`);
    result.data.docs.forEach(p=> {
        const book = {};
        book['title'] = p.title ? p.title : null;
        book['author'] = p.author_name ? p.author_name[0] : null;
        book['book_id'] = p.isbn ? p.isbn[0] : null;
        book_cache.push(book);
    });
    console.log(book_cache);
    let empty = false;
    if (book_cache.length == 0) empty = true;

    res.render('new.ejs', {
        books : book_cache,
        empty : empty
    })
});

app.get("/", async (req, res) => {
    // res.render("contact.ejs");
    res.redirect('/book');
});
app.get("/book", async (req, res) => {
    const result = await db.query("SELECT * FROM mylist ORDER BY id ASC");
    const data = result.rows;
    let empty = false;
    if (data.length == 0) empty = true;
    res.render("index.ejs", {
        books: data,
        empty : empty

    });
});


app.post("/edit", async (req, res) => {
    const type = req.body.type;
    const book_id = req.body.book_id;
    console.log(req.body);
    if (type === "delete") {
        const result = await db.query("DELETE FROM mylist WHERE book_id = $1 RETURNING *", [book_id]);
        res.redirect('/book');
    } else if(type === "edit") {
        const result = await db.query("SELECT * FROM mylist WHERE book_id = $1", [book_id]);
        const book = result.rows[0];
        res.render("edit.ejs", {
            book: book,
            post: book
        })
    } else {
        const index = book_cache.findIndex(p => p.book_id == book_id);
        const book = book_cache[index];
        res.render('edit.ejs', {
            book: book
        });
        // 끝난후 
    }
});

app.post('/posts/:book_id', async (req, res) => {
    const type = req.body.type;
    const book_id = req.params.book_id;
    const book_review = req.body.review;
    const book_rate = req.body.rate > 5 ?  5 : req.body.rate;
    const date = new Date();
    if (type == 'edit') await db.query("UPDATE mylist SET review = $1, date = $2, rate = $3 WHERE book_id = $4", [book_review,date,book_rate,book_id]);
    else {
        const index = book_cache.findIndex(p => p.book_id == book_id);
        const book = book_cache[index];
        await db.query("INSERT INTO mylist (title,author,book_id,rate,date,review) VALUES ($1,$2,$3,$4,$5,$6)", [book.title,book.author,book_id,book_rate,date,book_review]);
    }
    res.redirect('/book');
})

app.listen(port, () => {
    console.log("Listening to port number " + port);
});