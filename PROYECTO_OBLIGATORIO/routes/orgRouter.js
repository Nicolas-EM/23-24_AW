"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios

let orgRouter = require('express').Router();

orgRouter.get("/", (req, res, next) => {
    res.render("admin", { csrfToken: req.csrfToken(), isAdmin: req.session.isAdmin });
});

orgRouter.post("/update", (req, res, next) => {
    // TODO: update org
});

module.exports = orgRouter;