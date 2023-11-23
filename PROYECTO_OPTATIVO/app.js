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
const multer = require("multer");
const multerFactory = multer();

const DAO = require('./db/DAO');
const loginHandler = require('./middleware/login');
const flashMiddleware = require('./middleware/flash');
const errorHandler = isDevBuild ? require('./middleware/errorDev') : require('./middleware/errorProd');
const error404Handler = require('./middleware/error404');
const apiRouter = require("./routes/api");

//BASE DE DATOS
const pool = require("./db/pool");

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
app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: true, }));
app.use(flashMiddleware);

// INICALIZARDO APLICACION WEB
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

//utilizamos enrutador:
app.use('/api', apiRouter);

//GET DE LA PAGINA INDEX
app.get('/', function (req, res, next) {
    res.status(200).render("index", { isAuthenticated: req.session.user !== undefined, source: "/"});
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
                if (err) {
                    next(err);
                }
                if (passwordMatch) {
                    // If valid credentials, create a session
                    req.session.user = { email, id: userData.id };
                    res.setFlash('Sesión iniciada.');
                    res.redirect(source);
                } else {
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
    if (!nombre || !email || !password) {
        res.setFlash("Error: Por favor, completa todos los campos.");
        return res.redirect(source);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.setFlash("Error: Por favor, ingresa una dirección de correo electrónico válida.");
        return res.redirect(source);
    }
    const passwordRegex = /^(?=.*\d).{7,}$/;
    if (password.length < 7 || !passwordRegex.test(password)) {
        res.setFlash("Error: La contraseña debe tener al menos 7 caracteres y contener al menos un número.");
        return res.redirect(source);
    }
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
                // If valid credentials, create a session
                req.session.user = { email, id: userId };
                res.setFlash('Exito: Cuenta creada');
                res.redirect(source);
            }
            else {
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
    if (numPersonas <= 0) {
        res.setFlash('Error: Numero de personas no valido');
        res.redirect('/destination/' + destinoId);
    }
    Dao.isDestinoAvailable({ destinoId, numPersonas, startDate, endDate }, function (err, isAvailable) {
        if (err) {
            next(err);
        } else {
            if (isAvailable) {
                Dao.createReserva({ destinoId, numPersonas, startDate, endDate, userId }, function (err, reservaId) {
                    if (err) {
                        next(err);
                    } else {
                        res.setFlash('Exito: Reserva creada');
                        res.redirect('/user');
                    }
                });
            }
            else {
                next({ status: 500, message: `Error: Fechas no disponibles`, stack: "/reservar" });
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
                        res.setFlash('Exito: Reserva cancelada');
                        res.redirect('/user');
                    }
                })
            }
            else {
                next({ status: 500, message: `Reserva ${reservaId} does not exist for user ${userId}`, stack: "/reservar" });
            }
        }
    })
});

//POST PARA CREAR UNA RESEÑA
app.post('/review', loginHandler, (req, res, next) => {
    const userId = req.session.user.id;
    let { reservaId, comment, rating } = req.body;
    Dao.getReservaById(reservaId, function (err, row) {
        if (err) {
            next(err);
        } else {
            if (row) {
                if (row.reviewed === 1) {
                    // Reseña ya existe
                    res.setFlash('Error: Reseña ya existe para este destino');
                    res.redirect('/user');
                } else {
                    Dao.getSingleUserById(userId, function (err, user) {
                        if (err) {
                            next(err);
                        } else {
                            Dao.crearComentario(row.destino_id, user.nombre, comment, rating, function (err, rowId) {
                                if (err) {
                                    next(err);
                                } else {
                                    Dao.updateReservaReviewed(reservaId, function (err, affectedRows) {
                                        if (err || affectedRows > 1) {
                                            next(err);
                                        } else {
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
                next({ status: 500, message: `Reserva ${reservaId} does not exist for user ${userId}`, stack: "/review" });
            }
        }
    });
});

//POST PARA ACTUALIZAR USUARIO
app.post('/updateUser', loginHandler, (req, res, next) => {
    const { id, email } = req.session.user;

    let { name, correo, currentPassword, newPassword } = req.body;
    // nos pasamos al post el currentpassword pero no se evalua 
    // porque ya se hizo al registrarse o previo cambio.
    if (!name || !correo || !currentPassword) {
        res.setFlash("Error: Por favor, completa todos los campos.");
        return res.redirect("/user");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        res.setFlash("Error: Por favor, ingresa una dirección de correo electrónico válida.");
        return res.redirect("/user");
    }

    Dao.getSingleUser(email, function (err, userData) {
        if (err) {
            next(err);
        }
        else {
            let newUsername = name;
            let newEmail = correo;
            let newPwd;
            if (newPassword === '')
                newPwd = userData.password;
            else {
                const passwordRegex = /^(?=.*\d).{7,}$/;
                if (newPassword.length < 7 || !passwordRegex.test(newPassword)) {
                    res.setFlash("Error: La contraseña debe tener al menos 7 caracteres y contener al menos un número.");
                    return res.redirect("/user");
                }

                // Create hasher
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                newPwd = bcrypt.hashSync(newPassword, salt);
            }

            //compare realiza el hash de la contraseña y luego la compara.
            bcrypt.compare(currentPassword, userData.password, (err, passwordMatch) => {
                if (err) {
                    next(err);
                }
                if (passwordMatch) {
                    Dao.updateUser({ newUsername, newEmail, newPwd, id }, (err) => {
                        if (err) {
                            next(err);
                        } else {
                            req.session.user = { email: newEmail, id };
                            res.setFlash('Exito: Usuario actualizado');
                            res.redirect("/user");
                        }
                    });
                } else {
                    res.setFlash('Credenciales incorrectas.');
                    res.redirect("/user");
                }
            });
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