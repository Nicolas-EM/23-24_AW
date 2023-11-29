"use strict";
const pool = require("../db/pool");
const DAOReservas = require('../db/DAOReservas');
const DaoReservas = new DAOReservas(pool);
const DAOUser = require('../db/DAOUser');
const DaoUser = new DAOUser(pool);
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
class userController {
    getUser(req, res, next) {
        const userId = req.session.userId;
        DaoUser.getSingleUser(userId, function (err, user) {
            if (err) {
                next(err);
            }
            else {
                DaoReservas.getReservas(userId, function (err, reservas) {
                    if (err) {
                        next(err);
                    } else {
                        if(user.fotoFilename && user.fotoMimetype){
                            const imagePath = path.join(__dirname, '../uploads', user.fotoFilename);
                            const imageBuffer = fs.readFileSync(imagePath);
                            const base64Image = Buffer.from(imageBuffer).toString('base64');
                            user.fotoPerfil = `data:${user.fotoMimetype};base64,${base64Image}`
                        } else {
                            user.fotoPerfil = null;
                        }
                        res.status(200).render("user", { isAuthenticated: true, user, reservas });
                    }
                });
            }
        });
    }

    register(req, res, next) {
    
        // si encuentra error, devuelve 400:
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        // Create hasher
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
    
        DaoUser.createUser({ name, email, hashedPassword }, function (err, userId) {
            if (err) {
                if (err.errno === 1062) {
                    res.status(400).send("Error: Your account already exists, please log in");
                } else {
                    res.status(500).send(err);
                }
            } else {
                console.log("here");
                if (userId !== undefined) {
                    // If valid credentials, create a session
                    req.session.userId = userId;
                    res.send('Success: Account created');
                } else {
                    res.status(400).send("Error: Your account already exists, please log in");
                }
            }
        });
    }

    login(req, res, next) {
        const { email, password } = req.body
    
        DaoUser.getSingleUserByEmail(email, function (err, userData) {
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
                        req.session.userId = userData.id
    
                        res.send("Sesión iniciada.");
                    } else {
                        res.status(401).send("Error: Credenciales incorrectas");
                    }
                });
            }
        });
    }

    logout(req, res, next) {        
        req.session.destroy(() => {
            res.send("Sessión cerrada.");
        });
    }

    uploadPicture(req, res, next) {
        const file = req.file;
        if (!file) {
            return res.status(400).send('Error: No file uploaded');
        }
    
        DaoUser.updateUserPicture(req.session.userId, file.filename, file.mimetype, function (err) {
            if (err) {
                next(err);
            } else {
                res.send('Exito: Foto de perfil actualizada');
            }
        });
    }

    update(req, res, next) {
        let { nombre, correo, currentPassword, newPassword, newPasswordConfirm, userId } = req.body;
        // nos pasamos al post el currentpassword pero no se evalua 
        // porque ya se hizo al registrarse o previo cambio.
        if (!nombre && !correo && !newPassword) {
            return res.status(400).send("Error: Por favor, completa al menos uno de los campos (nombre, correo, contraseña).");
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo && !emailRegex.test(correo)) {
            return res.status(400).send("Error: Por favor, ingresa una dirección de correo electrónico válida.");
        }
    
        DaoUser.getSingleUser(userId, function (err, userData) {
            if (err) {
                next(err);
            }
            else {
                let newUsername = nombre ? nombre : userData.username;
                let newEmail = correo ? correo : userData.email;
                let newPwd = userData.password;
    
                if (newPassword) {
                    const passwordRegex = /^(?=.*\d).{7,}$/;
                    if (newPassword.length < 7 || !passwordRegex.test(newPassword)) {
                        return res.status(400).send("Error: La contraseña debe tener al menos 7 caracteres y contener al menos un número.");
                    }
    
                    if (newPassword !== newPasswordConfirm) {
                        return res.status(400).send("Error: Las contraseñas no coinciden.");
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
                        DaoUser.updateUser({ newUsername, newEmail, newPwd, userId }, (err) => {
                            if (err) {
                                next(err);
                            } else {
                                //req.session.userId = id;
                                res.send({
                                    message: 'Exito: Usuario actualizado',
                                    newUsername: newUsername,
                                    newEmail: newEmail
                                });
                            }
                        });
                    } else {
                        res.status(400).send('Credenciales incorrectas.');
                    }
                });
            }
        });
    }
}

module.exports = userController;