"use strict";
// routers
const adminRouter = require("./routes/adminRouter");
const facultyRouter = require("./routes/facultyRouter");
const installationRouter = require("./routes/installationRouter");
const messageRouter = require("./routes/messageRouter");
const reservationRouter = require("./routes/reservationRouter");
const userRouter = require("./routes/userRouter");

//modulos requeridos:
const express = require("express");
const mime = require('mime');
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//sql
const MySQLStore = require("express-mysql-session")(session);
const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "",
  database: "UCM_RIU",
  createDatabaseTable: true,
});

const app = express();
app.use(cookieParser());
const morgan = require("morgan");
app.use(morgan("tiny")); //la version mas pequeña

//GESTOR DE PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); // For handling JSON in request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Sesiones
app.use(
  session({
    saveUninitialized: false,
    secret: "ucm-riu",
    resave: false,
    store: sessionStore,
  })
);

// Seguridad CSRF(Cross-Site Request Forgery)
const csrf = require("csurf");
app.use(csrf({ cookie: true }));
app.use(cookieParser());

const _PORT = process.env.PORT || 3000;
app.listen(_PORT, () => {
  console.log(`Server running on port ${_PORT}`);
});

//todos nuestros enrutadores:
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/reservations", reservationRouter);
app.use("/installations", installationRouter);
app.use("/faculties", facultyRouter);
app.use("/messages", messageRouter);

app.get("/", (req, res, next) => {
  res.render("dasboard");
});
