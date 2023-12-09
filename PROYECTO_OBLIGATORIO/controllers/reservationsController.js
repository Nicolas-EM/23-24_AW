"use strict";
const pool = require("../db/pool");
const DAOReservations = require('../db/DAOReservations');
const { validationResult } = require("express-validator");

const daoReservations = new DAOReservations(pool);

class reservationsController {
  createReservation(req, res, next) {
    console.log("createReservation");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    } else {
      const reservation = {
        userid: req.session.userId,
        instid: req.body.installationId,
        dateini: req.body.startDate,
        dateend: req.body.endDate,
        datecreation: new Date(),
      };

      daoReservations.createReservation(reservation, (err, result) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json(result);
        }
      });
    }
  }
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
