"use strict";
let apiRouter = require('express').Router();
const pool = require("../db/pool");
const ejs = require('ejs');
const path = require('path');

const DAO = require('../db/DAO');
const Dao = new DAO(pool);

const fragmentsPath = path.join(__dirname, "../views/fragments");

// Get varios destinos
apiRouter.get("/destinations", function (req, res, next) {
    Dao.getDestinos(function (err, destinos) {
        if (err) {
            next(err);
        }
        else {
            ejs.renderFile(path.join(fragmentsPath, "destination-grid.ejs"), { destinations: destinos }, {}, function (err, str) {
                if (err) {
                    next(err);
                }

                // Send the rendered EJS as the response    
                res.send(str);
            });
        }
    });
});

//POST PARA LA BUSQUEDA
apiRouter.post("/search", (req, res, next) => {
    const { query, maxPrice } = req.body;
    console.log(query, maxPrice);

    Dao.getSearch(query, maxPrice, function (err, destinos) {
        if (err) {
            next(err);
        } else {
            ejs.renderFile(path.join(fragmentsPath, "destination-grid.ejs"), { destinations: destinos }, {}, function (err, str) {
                if (err) {
                    next(err);
                }

                // Send the rendered EJS as the response    
                res.send(str);
            });
        }
    });
});

module.exports = apiRouter;