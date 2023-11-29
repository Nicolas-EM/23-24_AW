"use strict";
//MODULOS REQUERIDOS
require('dotenv').config();
const express = require('express');
///////////////////////////////////////
//usamos morgan para logear errores
const morgan = require("morgan");
app.use(morgan('tiny'));//la version mas pequeña
const mime = require('mime');
const path = require('path');
const errorHandler = process.env.DEV_BUILD === "TRUE" ? require('./middleware/errorDev') : require('./middleware/errorProd');
const error404Handler = require('./middleware/error404');
const userRoutes = require("./routes/userRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const reservasRoutes = require("./routes/reservasRoutes");

//BASE DE DATOS
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({ 
    host: "localhost",
    user: "admin_aw",
    password: "",
    database: "viajes",
    createDatabaseTable: true
});

const app = express();

//GESTOR DE PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//MIDDLEWARE
app.use(express.json()); // For handling JSON in request body
// Middleware para analizar datos codificados en formato URL en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Initialize session middleware
app.use(
    session({
        saveUninitialized: false,
        secret: "cheapbnb",
        resave: false,
        store: sessionStore
    })
);
//EXPRESS VALIDATOR
const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
//se usaria en algo asi:
// app.get("/registro", (req, res) => {
//     if(req.session.mailID === undefined){
//         res.status(200);
//         const errors = validationResult(req);
//         res.render("register", {
//             errores: errors.mapped(),
//             msgRegistro: false  
//         });
//     }
//     else{
//         res.render("main",{
//             nameUser: req.session.userName,
//             imageUser: req.session.image,
//         });
//     }
// });

// INICALIZARDO APLICACION WEB
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

//utilizamos enrutadores:
app.use('/users', userRoutes);
app.use('/destinations', destinationRoutes);
app.use('/reservas', reservasRoutes);

//GET DE LA PAGINA INDEX
app.get('/', function (req, res, next) {
    res.status(200).render("index", { isAuthenticated: (req.session.userId !== undefined) });
});

//MIDDLEWARE PARA ERRORES
app.use(errorHandler);
app.use(error404Handler);