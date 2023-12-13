"use strict";
const pool = require("../db/pool");
const DAOReservations = require("../db/DAOReservations");
const { validationResult } = require("express-validator");
const DAOInstallations = require("../db/DAOInstallations"); // Add this line
const daoInstallations = new DAOInstallations(pool); // Add this line
const daoReservations = new DAOReservations(pool);

class reservationsController {
  getAllReservations(req, res, next) {
    daoReservations.getAllReservations((err, reservations) => {
      if (err) next(err);
      else res.json(reservations);
    });
  }

  createReservation(req, res, next) {
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

      daoReservations.checkUserReservation(reservation, (err, result) => {
        if (err) {
          next(err);
        } else {
          if (!result) {
            daoReservations.createReservation(reservation, (err) => {
              if (err) {
                next(err);
              } else {
                res.send("You have successfully reserved this installation.");
              }
            });
          } else {
            res.send("You have already reserved this installation.");
          }
        }
      });
    }
  }

  deleteReservation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    } else {
      daoReservations.getReservationById(
        req.body.reservaid,
        (err, reservation) => {
          if (err) {
            next(err);
          } else {
            if (reservation) {
              daoReservations.deleteReservation(req.body.reservaid, (err) => {
                if (err) {
                  next(err);
                } else {
                  daoReservations.getNextInQueue(reservation, (err, result) => {
                    if (err) {
                      next(err);
                    } else {
                      if (result) {
                        daoReservations.deleteFromQueue(result, (err) => {
                          if (err) {
                            next(err);
                          } else {
                            daoReservations.createReservation(result, (err) => {
                              // TODO: revisar
                              console.log(result);
                            });
                          }
                        });
                      }
                    }
                  });
                  res.send("You have successfully deleted this reservation.");
                }
              });
            } else {
              res.send("This reservation does not exist.");
            }
          }
        }
      );
    }
  }

  searchReservations(req, res, next) {
    const { query, startDate, endDate } = req.body;

    daoReservations.searchReservations(
      query,
      startDate,
      endDate,
      (err, reservations) => {
        if (err) {
          next(err);
        } else {
          res.json(reservations);
        }
      }
    );
  }

  addToQueue(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    } else {
      const reservation = {
        dateini: req.body.startDate,
        dateend: req.body.endDate,
        datecreation: new Date(),
        userid: req.session.userId,
        instid: req.body.installationId,
      };
      daoReservations.checkUserReservation(reservation, (err, result) => {
        if (err) {
          next(err);
        } else {
          if (!result) {
            daoReservations.checkUserQueue(reservation, (err, result) => {
              if (err) {
                next(err);
              } else {
                if (!result) {
                  daoReservations.addToQueue(reservation, (err) => {
                    if (err) {
                      next(err);
                    } else {
                      res.send("You have successfully added to the queue.");
                    }
                  });
                } else {
                  res.send(
                    "You are already in the queue for this installation."
                  );
                }
              }
            });
          } else {
            res.send("You have already reserved this installation.");
          }
        }
      });
    }
  }

  getReservationsByUser(req, res, next) {
    const userId = req.params.id;

    daoReservations.getReservationsByUser(userId, (err, reservations) => {
      if (err) {
        next(err);
      } else {
        res.json(reservations);
      }
    });
  }

  getReservationsByInstallation(req, res, next) {
    const installationId = req.params.id;

    daoReservations.getReservationsByInstallation(
      installationId,
      (err, reservations) => {
        if (err) {
          next(err);
        } else {
          res.json(reservations);
        }
      }
    );
  }

  getStatsByUser(req, res, next) {
    daoReservations.getReservationsStatsByUser((err, stats) => {
      if (err) {
        next(err);
      } else {
        res.json(stats);
      }
    });
  }

  checkDate(req, res, next) {
    daoInstallations.getInstallationById(req.params.id, (err, installation) => {
      if (err) {
        next(err);
      } else {
        // Esto solo puede ser días, no horas, según la documentación
        let checkingDate = req.params.date;
        daoReservations.checkReservation(
          checkingDate,
          installation.id,
          (err, timeSlots) => {
            if (err) {
              next(err);
            } else {
              daoReservations.checkUserTimeSlots(
                checkingDate,
                installation.id,
                req.session.userId,
                (err, userTimeSlots) => {
                  if (err) {
                    next(err);
                  } else {
                    const times = {};
                    console.log(timeSlots, userTimeSlots);
                    for (let i = 0; i < timeSlots.length; i++) {
                      for (let j = 0; j < userTimeSlots.length; j++) {
                        if (
                          timeSlots[i].timeSlot === userTimeSlots[j].timeSlot
                        ) {
                          if (userTimeSlots[j].userR === 1) {
                            times[timeSlots[i].timeSlot] = "userReserved";
                          } else {
                            if(installation.type === 0){
                              if (timeSlots[i].numReservations > 0) {
                                times[timeSlots[i].timeSlot] = "occupied";
                              } else {
                                times[timeSlots[i].timeSlot] = "free";
                              }
                            }
                            else{
                              if (timeSlots[i].numReservations >= installation.capacity) {
                                times[timeSlots[i].timeSlot] = "occupied";
                              } else {
                                times[timeSlots[i].timeSlot] = "free";
                              }
                            }
                            
                          }
                          break; // Exit the inner loop once a match is found
                        }
                      }
                    }
                    res.json(times);
                  }
                }
              );
            }
          }
        );
      }
    });
  }

  getStatsByFaculty(req, res, next) {
    daoReservations.getReservationsStatsByFaculty((err, stats) => {
      if (err) {
        next(err);
      } else {
        res.json(stats);
      }
    });
  }
}

module.exports = reservationsController;
