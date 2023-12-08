"use strict";
const pool = require("../db/pool");
const DAOReservations = require('../db/DAOReservations');
const { validationResult } = require("express-validator");

const daoReservations = new DAOReservations(pool);

class reservationsController {

  getReservationsByUser(req, res, next) {
    const userId = req.params.id;

    daoReservations.getReservationsByUser(userId, (err, reservations) => {
      if(err)
        next(err);
      else
        res.json(reservations);
    });
  }

  getReservationsByFaculty(req, res, next) {
    
  }

  getStatsByUser(req, res, next) {
    daoReservations.getReservationsStatsByUser((err, stats) => {
      if(err)
        next(err);
      else
        res.json(stats);
    });
  }

  getStatsByFaculty(req, res, next) {
    daoReservations.getReservationsStatsByFaculty((err, stats) => {
      if(err)
        next(err);
      else
        res.json(stats);
    });
  }
}

module.exports = reservationsController;
