"use strict";
const pool = require("../db/pool");
const DAOReservas = require('../db/DAOReservas');
const DaoReservas = new DAOReservas(pool);
const DAOUser = require('../db/DAOUser');
const DaoUser = new DAOUser(pool);
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

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
                        if (user.fotoFilename && user.fotoMimetype) {
                            const imagePath = path.join(__dirname, '../uploads', user.fotoFilename);
                            const imageBuffer = fs.readFileSync(imagePath);
                            const base64Image = Buffer.from(imageBuffer).toString('base64');
                            user.fotoPerfil = `data:${user.fotoMimetype};base64,${base64Image}`
                        } else {
                            user.fotoPerfil = null;
                        }
                        res.status(200).render("user", { isAuthenticated: true, user, reservas, csrfToken: req.csrfToken() });
                    }
                });
            }
        });
    }

    register(req, res, next) {
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
        // If validation passes, proceed with the rest of the function
        let { nombre, correo, currentPassword, newPassword, newPasswordConfirm, userId } = req.body;

        DaoUser.getSingleUser(userId, function (err, userData) {
            if (err) {
                next(err);
            } else {
                let newUsername = nombre ? nombre : userData.username;
                let newEmail = correo ? correo : userData.email;
                let newPwd = userData.password;

                if (newPassword) {
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
                                res.send({
                                    message: 'Success: User updated',
                                    newUsername: newUsername,
                                    newEmail: newEmail
                                });
                            }
                        });
                    } else {
                        res.status(400).send('Incorrect credentials.');
                    }
                });
            }
        });
    }
}

module.exports = userController;