"use strict";
const pool = require("../db/pool");
const DAOReservas = require('../db/DAOReservas');
const DaoReservas = new DAOReservas(pool);
const DAOUser = require('../db/DAOUser');
const DaoUser = new DAOUser(pool);
const DAODestination = require('../db/DAODestination');
const DaoDestination = new DAODestination(pool);

class reservaController {
    createReserva(req, res, next) {
        const userId = req.session.userId;
        const { destinoId, numPersonas, startDate, endDate } = req.body;
    
        if (numPersonas <= 0) {
            res.status(400).send("Error: Numero de personas no valido");
        } else {
            DaoDestination.isDestinoAvailable({ destinoId, numPersonas, startDate, endDate }, function (err, isAvailable) {
                if (err) {
                    res.status(500).send("Error: Por favor intentalo más tarde.");
                } else {
                    if (isAvailable) {
                        DaoReservas.createReserva({ destinoId, numPersonas, startDate, endDate, userId }, function (err, reservaId) {
                            if (err) {
                                res.status(500).send("Error: Por favor intentalo más tarde.");
                            } else {
                                res.send("Reserva realizada con éxito!");
                            }
                        });
                    } else {
                        res.status(501).send(`Error: Fechas no disponibles`);
                    }
                }
            });
        }
    }

    cancelReserva(req, res, next) {
        const userId = req.session.userId;
        const { reservaId } = req.body
    
        DaoReservas.getSingleReserva(userId, reservaId, function (err, reservaExists) {
            if (err) {
                next(err);
            } else {
                if (reservaExists) {
                    DaoReservas.borrarReserva(reservaId, function (err, affectedRows) {
                        if (err || affectedRows > 1) {
                            next(err);
                        } else {
                            res.send('Exito: Reserva cancelada');
                        }
                    })
                }
                else {
                    res.status(500).send('Error: Reserva no existe');
                }
            }
        })
    }

    createComment(req, res, next) {
        const userId = req.session.userId;
        let { reservaId, comment, rating } = req.body;
    
        DaoReservas.getReservaById(reservaId, function (err, row) {
            if (err) {
                res.status(500).send("Error: Por favor intentalo más tarde.");
            } else {
                if (row) {
                    if (row.reviewed === 1) {
                        // Reseña ya existe
                        res.status(400).send("Error: Sólo puedes añadir 1 reseña por reserva");
                    } else {
                        DaoUser.getSingleUserById(userId, function (err, user) {
                            if (err) {
                                res.status(500).send("Error: Por favor intentalo más tarde.");
                            } else {
                                DaoDestination.crearComentario(row.destino_id, user.nombre, comment, rating, function (err, rowId) {
                                    if (err) {
                                        res.status(500).send("Error: Por favor intentalo más tarde.");
                                    } else {
                                        DaoReservas.updateReservaReviewed(reservaId, function (err, affectedRows) {
                                            if (err || affectedRows > 1) {
                                                res.status(500).send("Error: Por favor intentalo más tarde.");
                                            } else {
                                                res.send("¡Exito! Reseña añadida.");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    res.status(500).send("Error: La reserva no exista");
                }
            }
        });
    }
}

module.exports = reservaController;