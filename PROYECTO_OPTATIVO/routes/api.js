"use strict";
let apiRouter = require('express').Router();

const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcrypt');

const pool = require("../db/pool");
const loginHandler = require('../middleware/login');
const DAO = require('../db/DAO');

const Dao = new DAO(pool);

const fragmentsPath = path.join(__dirname, "../views/fragments");

function sendEjs(res, name, data) {
    ejs.renderFile(path.join(fragmentsPath, `${name}.ejs`), data, {}, function (err, str) {
        if (err) {
            console.log(err);
            next(err);
        }

        // Send the rendered EJS as the response    
        res.send(str);
    });
}

// Get varios destinos
apiRouter.get("/destinations", function (req, res, next) {
    Dao.getDestinos(function (err, destinations) {
        if (err) {
            next(err);
        }
        else {
            sendEjs(res, "destination-grid", { destinations });
        }
    });
});

//POST PARA LA BUSQUEDA
apiRouter.post("/search", (req, res, next) => {
    const { query, maxPrice } = req.body;
    console.log(query, maxPrice);

    Dao.getSearch(query, maxPrice, function (err, destinations) {
        if (err) {
            next(err);
        } else {
            sendEjs(res, "destination-grid", { destinations });
        }
    });
});

//POST PARA EL METODO LOGIN DEL USUARIO
apiRouter.post('/login', (req, res, next) => {
    const { email, password } = req.body

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
                    res.send("Sesión iniciada.");
                } else {
                    res.status(401).end();
                }
            });
        }
    });
});

//POST PARA EL METODO REGISTER DEL USUARIO
apiRouter.post('/register', (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).send("Error: Por favor, completa todos los campos.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).send("Error: Por favor, ingresa una dirección de correo electrónico válida.");
    }
    const passwordRegex = /^(?=.*\d).{7,}$/;
    if (password.length < 7 || !passwordRegex.test(password)) {
        res.status(400).send("Error: La contraseña debe tener al menos 7 caracteres y contener al menos un número.");
    }

    // Create hasher
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    Dao.createUser({ name, email, hashedPassword }, function (err, userId) {
        if (err) {
            if(err.errno === 1062){
                res.status(400).send("Error: Tu cuenta ya existe, por favor inicia sesión");
            } else {
                res.status(500).send(err);
            }
        }
        else {
            if (userId !== undefined) {
                // If valid credentials, create a session
                req.session.user = { email, id: userId };
                res.send('Exito: Cuenta creada');
            }
            else {
                res.status(400).send("Error: Tu cuenta ya existe, por favor inicia sesión");
            }
        }
    });
});

//GET PARA CUANDO EL USUARIO SALE DE SESION Y REDIRIGE AL INDEX
apiRouter.post('/logout', (req, res, next) => {
    console.log("logout");
    
    req.session.destroy(() => {
        res.send("Sessión cerrada.");
    });
});

//POST PARA LA RESERVA DEL USUARIO
apiRouter.post("/reservar", loginHandler, (req, res, next) => {
    const userId = req.session.user.id;
    const { destinoId, numPersonas, startDate, endDate } = req.body;

    if (numPersonas <= 0) {
        res.status(400).send("Error: Numero de personas no valido");
    } else {
        Dao.isDestinoAvailable({ destinoId, numPersonas, startDate, endDate }, function (err, isAvailable) {
            if (err) {
                res.status(500).send("Error: Por favor intentalo más tarde.");
            } else {
                if (isAvailable) {
                    Dao.createReserva({ destinoId, numPersonas, startDate, endDate, userId }, function (err, reservaId) {
                        if (err) {
                            res.status(500).send("Error: Por favor intentalo más tarde.");
                        } else {
                            res.send("Reserva realizada con éxito!");
                        }
                    });
                } else {
                    res.status(501).send(`Error: Fechas no disponibles`);
                }
            }
        });
    }
});

//POST PARA CANCELAR UNA RESERVA
apiRouter.post('/cancelar', loginHandler, (req, res, next) => {
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
                        res.send('Exito: Reserva cancelada');
                    }
                })
            }
            else {
                res.status(500).send('Error: Reserva no existe');
            }
        }
    })
});



module.exports = apiRouter;
// ...

// const fs = require('fs');

// app.post('/user/upload-picture', uploadDir.single('avatar'), (req, res, next) => {
//     const file = req.file;

//     if (!file) {
//         return res.status(400).send('Error: No file uploaded');
//     }

//     // Read the file and convert it into a Blob
//     let fileData = fs.readFileSync(file.path);
//     let blob = new Blob([fileData], { type: file.mimetype });
//     Dao.updateUserPicture(req.session.user.id, blob, function (err, affectedRows) {
//         if (err || affectedRows > 1) {
//             next(err);
//         } else {
//             //res.redirect('/user');
//         }
//     });//TODO

//     res.send('File uploaded successfully');
//     //cambiamos foto renderizando de nuevo...
// });

// ...
