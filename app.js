const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
var cookieParser = require("cookie-parser");
const app = express();

const AppError = require("./uttil/appError");
const globalErrorHandler = require("./uttil/errorHandler");

const testRoute = require("./route/testRoute");
const resultRoute = require("./route/resultRoute");
const adminRoute = require("./route/adminRoute");
const userRoute = require("./route/userRoute");

app.use(cors());
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(morgan("dev"));

// setting the view engine path
app.set("views", path.join(__dirname, "views"));

// setting the view engine
app.set("view engine", "ejs");

// as store is not provided so the default which is memory will be used as store
// app.use(
//   session({
//     name: process.env.SESSION_NAME,
//     resave: false, // do not save the session back to the store if it was never modified
//     saveUninitialized: false, // do not save any session thats uninialized i.e has no value
//     secret: process.env.SESSION_SECRET,
//     cookie: {
//       sameSite: false,
//       httpOnly: true,
//       maxAge: 900000000,
//       secure: false,
//     },
//   })
// );

app.use("/test", testRoute);
app.use("/result", resultRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.get("/login", (req, res, next) => {
  res.send(`
    <h1>Login</h1>
    <form method='post' action= '/user/login'>
        <input type="email" name="email" placeholder="Email" require />
        <input type="password" name="password" placeholder="password" require />
        <input type="submit" value="login"></input>
    </form>
  `);
});

app.get("/register", (req, res, next) => {
  res.send(`
    <h1>Register</h1>
    <form method='post' action= '/admin'>
        <input type="text" name="name" placeholder="Name" require />
        <input type="email" name="email" placeholder="Email" require />
        <input type="password" name="password" placeholder="password" require />
        <input type="password" name="passwordConfirm" placeholder="password confirm" require />
        <input type="submit" value="rigister"></input>
    </form>
  `);
});

// default undefined routes
app.all("*", (req, res, next) => {
  next(new AppError("This route is not defined", 404));
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
