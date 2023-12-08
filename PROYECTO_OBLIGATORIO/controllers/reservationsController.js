"use strict";
const pool = require("../db/pool");
const DAOReservations = require('../db/DAOReservations');
const { validationResult } = require("express-validator");

const daoReservations = new DAOReservations(pool);

class reservationsController {

  getReservationsByUser(req, res, next) {
    daoReservations.getReservationsStatsByUser((err, stats) => {
      if(err)
        next(err);
      else
        res.send(stats);
    });
  }

  getReservationsByFaculty(req, res, next) {
    daoReservations.getReservationsStatsByFaculty((err, stats) => {
      if(err)
        next(err);
      else
        res.send(stats);
    });
  }
}

module.exports = reservationsController;
