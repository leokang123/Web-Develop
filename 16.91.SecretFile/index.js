//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
const app = express();

var verified = false;
function verifing (req, res, next) {
    if ( req.body["password"] == "ILoveProgramming") verified = true;
    next();
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(verifing);

app.get("/", (req, res) => {
    console.log(req);
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
    // if (!verified) res.sendFile(__dirname + "/public/index.html");
    if (!verified) res.redirect("/");
    else res.sendFile(__dirname + "/public/secret.html");
    verified = false;
});

app.listen(port, (req, res) => {
    console.log(`Listening to Port ${port}`);
});