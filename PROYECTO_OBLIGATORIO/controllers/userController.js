"use strict";
const pool = require("../db/pool");
const DAOUsers = require('../db/DAOUsers');
const bcrypt = require('bcrypt');
const { check, validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');

const daoUser = new DAOUsers(pool);

class userController {
    register(req, res, next) {
        //express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, surname, faculty, grade, group, email, password } = req.body;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        daoUser.createUser({ name, surname, faculty, grade, group, email, hashedPassword }, function (err, userId) {
            if (err) {
                if (err.errno === 1062) {
                    res.status(400).send("Error: Your account already exists, please log in");
                } else {
                    res.status(500).send(err);
                }
            } else {
                if (userId !== undefined) {
                    req.session.userId = userId;
                    res.render('user', {
                        isAuthenticated: true, user: { name, surname, faculty, grade, group, email },
                        csrfToken: req.csrfToken()
                    });
                    //TODO revisar porque ahora mismo tema admin tendria que forzarse en la bbdd
                } else {
                    res.status(400).send("Error: Your account already exists, please log in");
                }
            }
        });
    }

    login(req, res, next) {
        //express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        daoUser.getUserByEmail(email, (err, user) => {
            if (err) {
                next(err);
            }
            else {
                bcrypt.compare(password, user.password, (err, passwordMatch) => {
                    if (err) {
                        next(err);
                    }
                    if (passwordMatch) {
                        // If valid credentials, create a session
                        req.session.userId = user.id

                        res.send("Sesión iniciada.");
                    } else {
                        res.status(401).send("Error: Credenciales incorrectas");
                    }
                });
            }
        })
    }
}

module.exports = userController;