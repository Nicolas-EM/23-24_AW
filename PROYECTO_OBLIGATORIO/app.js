"use strict";
// routers
const orgRouter = require("./routes/orgRouter");
const facultyRouter = require("./routes/facultyRouter");
const installationRouter = require("./routes/installationRouter");
const messageRouter = require("./routes/messageRouter");
const reservationRouter = require("./routes/reservationRouter");
const userRouter = require("./routes/userRouter");
const mysql = require("mysql");
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
const errorHandler = process.env.DEV_BUILD === "TRUE" ? require('./middleware/errorDev') : require('./middleware/errorProd');
const error404Handler = require('./middleware/error404');

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
const requireLogin = require('./middleware/requireLogin');

//todos nuestros enrutadores:
app.use("/org", requireLogin, orgRouter);
app.use("/users", userRouter);
app.use("/reservations", requireLogin, reservationRouter);
app.use("/installations", requireLogin, installationRouter);
app.use("/faculties", facultyRouter);
app.use("/messages", requireLogin, messageRouter);

const pool = require("./db/pool");
const DAOFaculties = require("./db/DAOFaculties");
const DAOUsers = require("./db/DAOUsers");
const DAOOrg = require('./db/DAOOrg');

const daoOrg = new DAOOrg(pool);

app.get("/", requireLogin, (req, res) => {
  daoOrg.getOrg((err, org) => {
    if (err)
      next(err);
    else
      res.render("dashboard", { csrfToken: req.csrfToken(), isAdmin: req.session.isAdmin, org });
  })
});

app.get("/login", (req, res) => {
  if (req.session && req.session.userId) {
    // user already signed in
    res.redirect("/");
  } else {
    const daoFaculties = new DAOFaculties(pool);

    daoFaculties.getFaculties((err, faculties) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        daoFaculties.getGrades((err, grades) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
          } else {
            daoFaculties.getGroups((err, groups) => {
              if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
              } else {
                console.log(faculties, grades, groups);
                res.render("login", { csrfToken: req.csrfToken(), faculties, grades, groups });
              }
            });
          }
        });
      }
    });
  }
});

app.get("/user", (req, res, next) => {
  daoOrg.getOrg((err, org) => {
    if (err)
      next(err);
    else {
      const daoUsers = new DAOUsers(pool);
      daoUsers.getUserById(req.session.userId, (err, user) => {
        if (err)
          next(err);
        else
          res.status(200).render("user", { user, csrfToken: req.csrfToken(), isAdmin: req.session.isAdmin, org });
      })
    }
  })
})

//MIDDLEWARE PARA ERRORES
app.use(errorHandler);
app.use(error404Handler);