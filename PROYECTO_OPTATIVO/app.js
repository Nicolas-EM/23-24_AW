"use strict";
// config if dev or prod
const isDevBuild = false;

//MODULOS REQUERIDOS
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const DAO = require('./db/DAO');
const loginHandler = require('./middleware/login');
const flashMiddleware = require('./middleware/flash');
const errorHandler = isDevBuild ? require('./middleware/errorDev') : require('./middleware/errorProd');
const error404Handler = require('./middleware/error404');

//BASE DE DATOS
const pool = mysql.createPool({
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: true, }));
app.use(flashMiddleware);

// INICALIZARDO APLICACION WEB
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

//GET DE LA PAGINA INDEX
app.get('/', function (req, res, next) {
    Dao.getDestinos(function (err, destinos) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).render("index", { isAuthenticated: req.session.user !== undefined, source: "/", destinations: destinos});
        }
    });
});

//POST PARA LA BUSQUEDA
app.post('/search', (req, res, next) => {
    const { query, maxPrice } = req.body;

    Dao.getSearch(query, maxPrice, function (err, destinos) {
        if (err) {
            next(err);
        }
        else {
            console.log(destinos);
            res.status(200).render('index', { isAuthenticated: req.session.user !== undefined, source: "/", destinations: destinos });
        }
    });

});

//POST PARA EL METODO LOGIN DEL USUARIO
app.post('/login', (req, res, next) => {
    const { email, password, source } = req.body

    Dao.getSingleUser(email, function (err, userData) {
        if (err) {
            next(err);
        }
        else {
            bcrypt.compare(password, userData.password, (err, passwordMatch) => {
                if(err){
                    next(err);
                }
                if(passwordMatch){
                    console.log("Authenticated");
                    // If valid credentials, create a session
                    req.session.user = { email, id: userData.id };
                    res.setFlash('Sesión iniciada.');
                    res.redirect(source);
                } else {
                    console.log("Denied");
                    res.setFlash('Credenciales incorrectas.');
                    res.redirect(source);
                }
            });
        }
    });
})

//POST PARA EL METODO REGISTER DEL USUARIO
app.post('/register', (req, res, next) => {
    const { nombre, email, password, source } = req.body;
    console.log(`Register from ${source}`);
    // Create hasher
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    Dao.createUser({ nombre, email, hashedPassword }, function (err, userId) {
        if (err) {
            return next(err);
        }
        else {
            if (userId !== undefined) {
                console.log("Registered");
                // If valid credentials, create a session
                req.session.user = { email, id: userId };
                res.setFlash('Exito: Cuenta creada');
                res.redirect(source);
            }
            else {
                console.log("Registration failed");
                res.setFlash("Error: Tu cuenta ya existe, por favor inicia sesión");
                res.redirect(source);
            }
        }
    });
})

//POST PARA LA RESERVA DEL USUARIO
app.post('/reservar', loginHandler, (req, res, next) => {
    const userId = req.session.user.id;
    const { destinoId, numPersonas, startDate, endDate } = req.body

    Dao.isDestinoAvailable({ destinoId, numPersonas, startDate, endDate }, function (err, isAvailable) {
        if (err) {
            next(err);
        } else {
            if (isAvailable) {
                Dao.createReserva({ destinoId, numPersonas, startDate, endDate, userId }, function (err, reservaId) {
                    if (err) {
                        next(err);
                    } else {
                        console.log(`Reserva con ID ${reservaId} creada`);
                        res.setFlash('Exito: Reserva creada');
                        res.redirect('/user');
                    }
                })
            }
            else {
                res.status(500).send('Dates not available');
            }
        }
    })
});

//POST PARA CANCELAR UNA RESERVA
app.post('/cancelar', loginHandler, (req, res, next) => {
    const userId = req.session.user.id;
    const { reservaId } = req.body

    Dao.getSingleReserva(userId, reservaId, function (err, reservaExists) {
        if (err) {
            next(err);
        } else {
            if (reservaExists) {
                Dao.borrarReserva(reservaId, function (err, affectedRows) {
                    if (err || affectedRows > 1) {
                        next(err);
                    } else {
                        console.log(`Reserva con ID ${reservaId} eliminada`);
                        res.setFlash('Exito: Reserva cancelada');
                        res.redirect('/user');
                    }
                })
            }
            else {
                res.status(500).send(`Reserva ${reservaId} does not exist for user ${userId}`);
            }
        }
    })
});

//POST PARA CREAR UNA RESEÑA
app.post('/review', loginHandler, (req, res, next) => {
    let userId = req.session.user.id;
    let { reservaId } = req.body;
    let comentario = req.body.comment;
    let puntuacion = req.body.rating;
    Dao.getReservaById(reservaId, function (err, row) {
        if (err) {
            next(err);
        } else {
            if (row) {
                if(row.reviewed === 1){
                    // Reseña ya existe
                    res.setFlash('Error: Reseña ya existe para este destino');
                    res.redirect('/user');
                } else {
                    Dao.getSingleUserById(userId, function (err, user) {
                        if (err) {
                            next(err);
                        } else {
                            Dao.crearComentario(row.destino_id, user.nombre, comentario, puntuacion, function (err, rowId) {
                                if (err) {
                                    next(err);
                                } else {
                                    console.log(`Reseña con ID ${rowId} creada`);
                                    Dao.updateReservaReviewed(reservaId, function (err, affectedRows) {
                                        if(err || affectedRows > 1){
                                            next(err);
                                        } else {
                                            console.log(`Reserva con ID ${reservaId} actualizada`);
                                            res.setFlash('Exito: Reseña creada');
                                            res.redirect('/user');
                                        }
                                    });
                                }
    
                            });
                        }
                    });
                }
            }
            else {
                next({status: 500, message: `Reserva ${reservaId} does not exist for user ${userId}`, stack: "/review"});
            }
        }
    });
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
                            res.status(200).render("destination", { isAuthenticated: req.session.user !== undefined, source: `/destination/${destinationId}`, dest, image_ids, comments: comments });
                        }
                    });
                }
            });
        }
    });
});

//GET DE LA PAGINA DE USUARIO PERSONALIZADA
app.get("/user", loginHandler, (req, res, next) => {
    const email = req.session.user.email;
    Dao.getSingleUser(email, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            Dao.getReservas(req.session.user.id, function (err, reservas) {
                if (err) {
                    next(err);
                } else {
                    res.status(200).render("user", { isAuthenticated: true, user, reservas })
                }
            });
        }
    });
});

//GET PARA CUANDO EL USUARIO SALE DE SESION Y REDIRIGE AL INDEX
app.get('/logout', (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
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