"use strict";
// routers
const orgRouter = require("./routes/orgRouter");
const facultyRouter = require("./routes/facultyRouter");
const installationRouter = require("./routes/installationRouter");
const messageRouter = require("./routes/messageRouter");
const reservationRouter = require("./routes/reservationRouter");
const userRouter = require("./routes/userRouter");

import('mime').then(() => {
  // Use the mime package here
}).catch((err) => {
  console.error(err);
});
//modulos requeridos:
const express = require("express");
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

// middleware login
const requireAdmin = require('./middleware/requireAdmin');
const requireLogin = require('./middleware/requireLogin')

//todos nuestros enrutadores:
app.use("/org", requireAdmin, orgRouter);
app.use("/users", userRouter);
app.use("/reservations", requireLogin, reservationRouter);
app.use("/installations", requireLogin, installationRouter);
app.use("/faculties", facultyRouter);
app.use("/messages", requireLogin, messageRouter);

app.get("/", (req, res) => {
  if (req.session.userId !== undefined) {
    res.render("/dashboard");
  } else {
    const faculties = [
      { value: "1", name: "Faculty 1" },
      { value: "2", name: "Faculty 2" },
      { value: "3", name: "Faculty 3" },
    ];
  
    const grades = [
      { value: "1", name: "Grade 1" },
      { value: "2", name: "Grade 2" },
      { value: "3", name: "Grade 3" },
    ];
  
    const groups = [
      { value: "1", name: "Group 1" },
      { value: "2", name: "Group 2" },
      { value: "3", name: "Group 3" },
    ];
    res.render("login",{ faculties, grades, groups });
  }
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});