// HINTS:
// 1. Import express and axios
import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";
// 3. Use the public folder for static files.
app.use(express.static("public"));
// 4. When the user goes to the home page it should render the index.ejs file.
app.use(bodyParser.urlencoded({extended: true}));
const yourBearerToken = "2ed0f8be-46c4-485e-be45-8a7b034db82f";

const body = {
    secret: "",
    user: ""
};


const config  = {
    Authentication : `Bearer ${yourBearerToken}`,
};

app.get("/", async (req, res) =>{
    try {
        const result = await axios.get(API_URL + "random");
        body.secret = result.data.secret;
        body.user = result.data.username;
        res.render("index.ejs", body);
    } catch(error) {
        res.status(404).send(error.message);
    }
});
// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
    console.log("Listening to port " + port);
});
