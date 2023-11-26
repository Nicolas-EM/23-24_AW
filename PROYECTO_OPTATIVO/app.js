"use strict";
// config if dev or prod
const isDevBuild = true;

//MODULOS REQUERIDOS
const express = require('express');

const bcrypt = require('bcrypt');
const mime = require('mime');
const path = require('path');
const crypto = require('crypto');
const DAO = require('./db/DAO');
const loginHandler = require('./middleware/login');
const errorHandler = isDevBuild ? require('./middleware/errorDev') : require('./middleware/errorProd');
const error404Handler = require('./middleware/error404');
const apiRouter = require("./routes/api");

//BASE DE DATOS
const pool = require("./db/pool");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({ 
    host: "localhost",
    user: "admin_aw",
    password: "",
    database: "viajes"
});

const app = express();
const Dao = new DAO(pool);
//GESTOR DE PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//todos los use son middleware y van en orden (el primer use ira el primero)

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

// INICALIZARDO APLICACION WEB
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

//utilizamos enrutador:
app.use('/api', apiRouter);

//GET DE LA PAGINA INDEX
app.get('/', function (req, res, next) {
    res.status(200).render("index", { isAuthenticated: (req.session.userId !== undefined) });
});


//GET PARA LA WEB PERSONALIZADA DE CADA DESTINO
app.get("/destination/:id", (req, res, next) => {
    const destinationId = req.params.id;
    // Find the destination object using id (for instance from a database)
    Dao.getDestinoById(destinationId, function (err, dest) {
        if (err) {
            next(err);
        } else {
            Dao.getDestinoImages(destinationId, function (err, image_ids) {
                if (err) {
                    next(err);
                } else {
                    Dao.getComments(destinationId, function (err, comments) {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).render("destination", { isAuthenticated: req.session.userId !== undefined, dest, image_ids, comments: comments });
                        }
                    });
                }
            });
        }
    });
});

//GET DE LA PAGINA DE USUARIO PERSONALIZADA
app.get("/user", loginHandler, (req, res, next) => {
    const userId = req.session.userId;
    Dao.getSingleUser(userId, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            Dao.getReservas(userId, function (err, reservas) {
                if (err) {
                    next(err);
                } else {
                    console.log(user.fotoPerfil);
                    user.fotoPerfil = `data:image/png;base64,${user.fotoPerfil.toString('base64')}`;
                    console.log(user.fotoPerfil);
                    res.status(200).render("user", { isAuthenticated: true, user, reservas })
                }
            });
        }
    });
});


//jpg to hex converter:
// function imageToHex(imgName) {
//     const bitmap = fs.readFileSync(`./resources/${imgName}.jpg`);
//     const hexadecimalImage = bitmap.toString('hex');
//     fs.writeFileSync(`./hexes/${imgName}.txt`, hexadecimalImage);
// }
// function hexToImage(hexFileName, outputFileName) {
//     const hexData = fs.readFileSync(`./hexes/${hexFileName}.txt`, 'utf8');
//     const buffer = Buffer.from(hexData, 'hex');
//     fs.writeFileSync(`./testingPhotos/${outputFileName}.jpg`, buffer);
//   }
// for(let i = 1; i <= 90; i++){
//     const hexData = fs.readFileSync(`./hexes/${i}.txt`, 'utf8');
//     const buffer = Buffer.from(hexData, 'hex');
//     fs.writeFileSync(`./testingPhotos/${i}.jpg`, buffer);
// }

//MIDDLEWARE PARA ERRORES
app.use(errorHandler);
app.use(error404Handler);