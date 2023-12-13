"use strict";

//const { check } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require("../middleware/requireAdmin");
const reservationsController = require("../controllers/reservationsController");

let reservationRouter = require("express").Router();
const ctrl = new reservationsController();

reservationRouter.get("/", requireAdmin, ctrl.getAllReservations);

reservationRouter.post("/create", ctrl.createReservation);

reservationRouter.post("/addToQueue", ctrl.addToQueue);

reservationRouter.post("/delete", ctrl.deleteReservation);

reservationRouter.post("/search", ctrl.searchReservations);

//check for a given installation what dates are available
reservationRouter.get("/check/:id/:date", ctrl.checkDate);

reservationRouter.get("/byUser/:id", requireAdmin, ctrl.getReservationsByUser);

reservationRouter.get("/byInstallation/:id", requireAdmin, ctrl.getReservationsByInstallation);

reservationRouter.get("/userStats", requireAdmin, ctrl.getStatsByUser);

reservationRouter.get("/facultyStats", requireAdmin, ctrl.getStatsByFaculty);

module.exports = reservationRouter;
