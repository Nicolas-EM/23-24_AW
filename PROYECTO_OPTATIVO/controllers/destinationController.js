"use strict";

require('dotenv').config()
const pool = require("../db/pool");
const DAODestination = require('../db/DAODestination');
const Dao = new DAODestination(pool);

const ejs = require('ejs');
const path = require('path');
const fragmentsPath = path.join(__dirname, "../views/fragments");

class destinationController {
    getSingleDestination(req, res, next) {
        const destinationId = req.params.id;
        // Find the destination object using id (for instance from a database)
        Dao.getDestinoById(destinationId, function (err, dest) {
            if (err) {
                next(err);
            } else {
                Dao.getDestinoImages(destinationId, function (err, image_ids) {
                    if (err) {
                        next(err);
                    } else {
                        Dao.getComments(destinationId, function (err, comments) {
                            if (err) {
                                next(err);
                            } else {
                                res.status(200).render("destination", { isAuthenticated: req.session.userId !== undefined, dest, image_ids, comments: comments });
                            }
                        });
                    }
                });
            }
        });
    }

    getDestinations(req, res, next) {
        Dao.getDestinos((err, destinations) => {
            if (err) {
                next(err);
            }
            else {
                ejs.renderFile(path.join(fragmentsPath, `destination-grid.ejs`), { destinations }, {}, function (err, str) {
                    if (err) {
                        next(err);
                    }
            
                    // Send the rendered EJS as the response    
                    res.send(str);
                });
            }
        });
    }

    searchDestinations(req, res, next) {
        const { query, minPrice, maxPrice } = req.body;
    
        if(minPrice < 0 || minPrice > maxPrice || maxPrice < minPrice || maxPrice <= 0){
            res.status(400).send("Error: Los filtros de precio son incorrectos");
        }
    
        Dao.getSearch(query, minPrice, maxPrice, function (err, destinations) {
            if (err) {
                next(err);
            } else {
                ejs.renderFile(path.join(fragmentsPath, `destination-grid.ejs`), { destinations }, {}, function (err, str) {
                    if (err) {
                        console.log(err);
                        next(err);
                    }
            
                    // Send the rendered EJS as the response    
                    res.send(str);
                });
            }
        });
    }
}

module.exports = destinationController;