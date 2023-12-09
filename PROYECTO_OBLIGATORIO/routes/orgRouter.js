"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
const pool = require("../db/pool");
let orgRouter = require('express').Router();
const daoF = require('../db/DAOFaculties');
const daoFaculties = new daoF(pool);

orgRouter.get("/", (req, res, next) => {
    daoFaculties.getFaculties((err, faculties) => {
        if (err) {
            next(err);
        } else {
            res.render("admin", { csrfToken: req.csrfToken(), isAdmin: req.session.isAdmin, faculties: faculties });
        }
    });
});

orgRouter.post("/update", (req, res, next) => {
    // TODO: update org
});

module.exports = orgRouter;