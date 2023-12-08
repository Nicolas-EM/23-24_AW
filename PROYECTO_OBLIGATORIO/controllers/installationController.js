"use strict";
const pool = require("../db/pool");
const DAOInstallations = require('../db/DAOInstallations');
const { validationResult } = require("express-validator");

const daoInstallations = new DAOInstallations(pool);

class installationController {
    getInstallations(req, res, next) {
        daoInstallations.getAllInstallations((err, installations) => {
            if(err){
                next(err);
            } else {
                res.send(installations);
            }
        })
    }
}

module.exports = installationController;