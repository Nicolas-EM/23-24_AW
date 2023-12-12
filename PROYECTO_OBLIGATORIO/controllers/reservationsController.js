"use strict";
const pool = require("../db/pool");
const DAOReservations = require('../db/DAOReservations');
const { validationResult } = require("express-validator");
const DAOInstallations = require('../db/DAOInstallations');
const daoInstallations = new DAOInstallations(pool);
const daoReservations = new DAOReservations(pool);

class reservationsController {


  createReservation(req, res, next) {
    console.log("createReservation from controller!");
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
          res.send("Reservation created successfully");
        }
      });
    }
  }
  getReservationsByUser(req, res, next) {
    const userId = req.params.id;

    daoReservations.getReservationsByUser(userId, (err, reservations) => {
      if (err)
        next(err);
      else
        res.json(reservations);
    });
  }

  getReservationsByFaculty(req, res, next) {

  }

  getStatsByUser(req, res, next) {
    daoReservations.getReservationsStatsByUser((err, stats) => {
      if (err)
        next(err);
      else
        res.json(stats);
    });
  }

  checkDate(req, res, next) {
    daoInstallations.getInstallationById(req.params.id, (err, installation) => {
      if (err) {
        next(err);
      } else {
        if (installation) {
          // Esto solo puede ser días, no horas, según la documentación
          let checkingDate = req.params.date;
          daoReservations.checkReservation(checkingDate,installation.id,(err,timeSlots) =>{
            if(err){
              next(err);
            }
            else{
              if(timeSlots){
                console.log(timeSlots);
                let availabletimes = {};
                //colectivo
                if(installation.type === 0){
                  for (var i = 0; i < timeSlots.length; i++) {
                    console.log(availabletimes);
                    var slot = timeSlots[i];
                    var timeSlotKey = slot['Time Slot'];
                
                    availabletimes[timeSlotKey] = slot['numReservations'] > 0;
                  }
                }
                else{
                  for (var i = 0; i < timeSlots.length; i++) {
                    console.log(availabletimes);
                    var slot = timeSlots[i];
                    var timeSlotKey = slot['Time Slot'];
                
                    availabletimes[timeSlotKey] = slot['numReservations'] >= installation.capacity;
                  }
                }
                console.log(availabletimes);
                res.json(availabletimes);
              }
              else{
                res.json({});
              }
            }
          });
        }
      }
    });
  }
  


  getStatsByFaculty(req, res, next) {
    daoReservations.getReservationsStatsByFaculty((err, stats) => {
      if (err)
        next(err);
      else
        res.json(stats);
    });
  }
}

module.exports = reservationsController;
