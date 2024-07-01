import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: "TOPSECRETWORD",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}));
// session이 세팅된후 passport를 미들웨어로 세팅해야한다 
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "6256",
  port: 5432,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
})

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email]
  };

  try {
    const checkResult = await db.query(query);
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {

        const hashQuery = {
          text: "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
          values: [email, hash]
        };

        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const result = await db.query(hashQuery);
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log(err);
            res.redirect("/secrets");
          })
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
}));

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
});
// req.body에 저장되는 키가 username, password로 같으면 passport에서 자동으로 파싱시켜줘서 따로 파싱해줄필요없다 
// 다른 키인 경우(userid, passwd와 같은.. ) 따로 처리를 해줘야한다 ({usernameField: 'userid', passwordField: 'password', ...})
// passport.use(new Strategy(async function verify(username, password, cb) {
passport.use(new Strategy({usernameField: 'userid', passwordField: 'passwd'}, async function verify(userid, passwd, cb) {
  const password = passwd;
  const username = userid;
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [username]
  };
  try {
    const result = await db.query(query);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          return cb(err);
        } else {
          if (result) {
            return cb(null, user);
          } else {
            return cb(null, false, { message: "Incorrect Password" });
          }
        }
      });
    } else {
      return cb(null, false, { message: "User not Found" });
    }
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    // { id: user.id, email: user.email } 이 꼴로 세션에 저장하겠다는 뜻임 
    // cb(null, { id: user.id });
    cb(null, { id: user.id, email: user.email });
  });
});


passport.deserializeUser(function (user, cb) {
  // 이런식으로도 할수 있다 (session에서 id만 저장하고 db에서 조회해서 정보주기)
  // const result = await db.query("SELECT * FROM users WHERE id = $1",[id.id]);
  // const user = result.rows[0];
  process.nextTick(function () {
    // 이런식이면 저장되어있는 세션을 불러올수 있다 
    return cb(null, user);
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
