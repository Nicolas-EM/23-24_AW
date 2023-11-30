"use strict";
//modulos requeridos:

const express = require('express');
const mime = require('mime');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//sql
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({ 
    host: "localhost",
    user: "root",
    password: "",
    database: "UCM_RIU",
    createDatabaseTable: true
});

const app = express();
app.use(cookieParser());
const morgan = require("morgan");
app.use(morgan('tiny'));//la version mas pequeña

//GESTOR DE PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); // For handling JSON in request body

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        saveUninitialized: false,
        secret: "ucm-riu",
        resave: false,
        store: sessionStore
    })
);

// Seguridad CSRF(Cross-Site Request Forgery)
const csrf = require('csurf');
app.use(csrf({ cookie: true }));
app.use(cookieParser());

const _PORT = process.env.PORT || 3000;
app.listen(_PORT, () => {
    console.log(`Server running on port ${_PORT}`);
});
//todos nuestros enrutadores:
app.use('/admin',adminRoutes);
app.use('/users',userRoutes);
app.use('/reservations',reservationRoutes);
app.use('/installations',installationRoutes);
app.use('/faculties',facultyRoutes);
app.use('/messages',messageRoutes);


app.get('/', function (req, res, next) {
    
});