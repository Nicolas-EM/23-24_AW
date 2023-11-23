"use strict";
let apiRouter = require('express').Router();
const pool = require("../db/pool");
const ejs = require('ejs');
const path = require('path');
const loginHandler = require('../middleware/login');
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

//TODO aqui estaba metido loginHandler y ya no..?
apiRouter.post("/reservar", loginHandler, (req, res, next) => {
    const userId = req.session.user.id;
    const { destinoId, numPersonas, startDate, endDate } = req.body;
    if (numPersonas <= 0) {
        res.json({ error: "Error: Numero de personas no valido" });
    } else {
        Dao.isDestinoAvailable({ destinoId, numPersonas, startDate, endDate }, function (err, isAvailable) {
            if (err) {
                next(err);
            } else {
                if (isAvailable) {
                    Dao.createReserva({ destinoId, numPersonas, startDate, endDate, userId }, function (err, reservaId) {
                        if (err) {
                            next(err);
                        } else {
                            ejs.renderFile(path.join(fragmentsPath, "flash.ejs"), { message: "Reserva realizada con éxito!",toastId: `createdReserva-${reservaId}`}, {}, function (err, str) {
                                if (err) {
                                    next(err);
                                }
                                else{
                                    res.send(str);
                                }
                            });
                        }});
                } else {
                    next({ status: 500, message: `Error: Fechas no disponibles`, stack: "/reservar" });
                }
            }
        });
    }
});

module.exports = apiRouter;
