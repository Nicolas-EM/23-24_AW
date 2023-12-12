"use strict";
const pool = require("../db/pool");
const DAOOrg = require('../db/DAOOrg');
const daoF = require('../db/DAOFaculties');
const { validationResult } = require("express-validator");

const daoOrg = new DAOOrg(pool);
const daoFaculties = new daoF(pool);

class orgController {
    getIndex(req, res, next){
        daoOrg.getOrg((err, org) => {
            if(err)
                next(err);
            else {
                daoFaculties.getFaculties((err, faculties) => {
                    if (err) {
                        next(err);
                    } else {
                        res.render("admin", { csrfToken: req.csrfToken(), isAdmin: req.session.isAdmin, org, faculties: faculties });
                    }
                });
            }
        })
    }

    getPicture(req, res, next) {
        daoOrg.getPicture((err, picture) => {
            if(err)
                next(err);
            else
                res.end(picture);
        })
    };

    updatePicture(req, res, next) {
        const file = req.file;
        if (!file) {
            return res.status(400).send('Error: No file uploaded');
        }

        daoOrg.setPicture(file.buffer, (err) => {
            if(err)
                next(err);
            else
                res.send("OK");
        })
    }

    update(req, res, next) {
        const { name, dir} = req.body;

        daoOrg.updateOrg(name, dir, (err) => {
            if(err)
                next(err);
            else
                res.send("OK");
        })
    }
}

module.exports = orgController;