import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://pokeapi.co/api/v2/pokemon/"
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
const body = {
    type: "None",
    name: "Who Am I",
}

app.get("/", (req, res) => {
    res.render("index.ejs",body);
})

app.get("/random", async(req, res) => {
    const randnum = Math.floor(Math.random() * 1025) + 1;
    console.log(randnum);
    try {
        const response = await axios.get(API_URL + randnum);
        const result = response.data;
        const img = await axios.get(result.forms[0].url);
        body.type = result.types[Math.floor(Math.random() * result.types.length)].type.name;
        body.name = result.forms[0].name;
        body.image = img.data.sprites.front_default;
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
})
app.listen(port, () => {
    console.log("Server is Listening to port " + port);
})