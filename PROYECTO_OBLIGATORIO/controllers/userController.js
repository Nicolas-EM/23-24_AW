"use strict";
const pool = require("../db/pool");
const DAOUsers = require('../db/DAOUsers');
const DAOMessages = require('../db/DAOMessages');
const bcrypt = require('bcrypt');
const { check, validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');

const daoUser = new DAOUsers(pool);
const daoMessages = new DAOMessages(pool);

class userController {
    getUserById(req, res, next) {
        const userId = req.params.id;

        daoUser.getUserById(userId, (err, user) => {
            if (err)
                next(err);
            else{
                delete user.password;
                res.json(user);
            }
        })
    }

    getAllUsers(req, res, next) {
        daoUser.getAllUsers((err, users) => {
            if (err)
                next(err);
            else
                res.json(users);
        })
    }

    register(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, surname, faculty, grade, group, email, password } = req.body;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        let img = req.file;
        if(img === undefined) {
            img = null;
        } else {
            img = img.buffer;
        }

        daoUser.createUser({ 
            name, 
            surname, 
            facultyId: faculty, 
            grade, 
            ugroup: group, 
            email, 
            password: hashedPassword, 
            profileImage: img, 
            isAdmin: false, 
            isValidated: false 
        }, function (err, userId) {
            if (err) {
                if (err.errno === 1062) {
                    res.status(400).send("Error: Your account already exists, please log in");
                } else {
                    res.status(500).send(err);
                }
            } else {
                if (userId !== undefined) {
                    req.session.userId = userId;
                    req.session.isAdmin = false;

                    res.send("OK");
                } else {
                    res.status(400).send("Error: Your account already exists, please log in");
                }
            }
        });
    }

    login(req, res, next) {
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
                        req.session.isAdmin = (user.isAdmin === 1);

                        res.send("OK");
                    } else {
                        res.status(401).send("Error: Incorrect credentials");
                    }
                });
            }
        })
    }

    logout(req, res, next) {
        req.session.destroy(() => {
            res.redirect("/");
        });
    }

    validateUser(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.body;

        daoUser.validateUser(userId, (err) => {
            if (err)
                next(err);
            else {
                daoMessages.createNewMessage(1, userId, "Your account has been validated. You can now create reservations.", (err) => {
                    if(err)
                        next(err);
                    else
                        res.send("OK");
                })
            }
        })
    }

    updateUser(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.session.userId;
        let { name, surname, email, password } = req.body;

        daoUser.getUserById(userId, (err, user) => {
            if(err)
                next(err);
            else {
                let hashedPassword;
                if(!password)
                    hashedPassword = user.password;
                else {
                    const saltRounds = 10;
                    const salt = bcrypt.genSaltSync(saltRounds);
                    hashedPassword = bcrypt.hashSync(password, salt);
                }

                daoUser.updateUser({ id: userId, name, surname, email, password: hashedPassword}, (err) => {
                    if(err)
                        next(err);
                    else
                        res.send("OK");
                });
            }
        })
    }

    updateUserRole(req, res, next) {
        const { userId, role } = req.body;

        daoUser.updateUserRole({ id: userId, isAdmin: role}, (err) => {
            if(err)
                next(err);
            else
                res.send("OK");
        })
    }

    uploadPicture(req, res, next) {
        const file = req.file;
        if (!file) {
            return res.status(400).send('Error: No file uploaded');
        }

        daoUser.uploadPicture(req.session.userId, file, (err) => {
            if(err)
                next(err);
            else {
                res.send("OK");
            }
        })
    }

    getPicture(req, res, next) {
        const userId = req.params.id;

        daoUser.getPicture(userId, (err, picture) => {
            if(err)
                next(err);
            else{
                if(picture){
                    res.end(picture);
                } else {
                    res.status(404).end();
                }
            }
        })
    }

    searchUsers(req, res, next) {
        const { query, isAdmin, isValidated, facultyId } = req.body;

        daoUser.searchUsers(query, isAdmin, isValidated, facultyId, (err, users) => {
            if(err)
                next(err);
            else
                res.json(users);
        })
    }

    getUsersByFaculty(req, res, next) {
        const facultyId = req.params.id;

        daoUser.getUserByFaculty(facultyId, (err, users) => {
            if(err)
                next(err);
            else
                res.send(users);
        })
    }
}

module.exports = userController;