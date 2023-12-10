"use strict";

//const { check } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const reservationsController = require('../controllers/reservationsController');

let reservationRouter = require('express').Router();
//const { isAfter, addHours } = require('date-fns');
const ctrl = new reservationsController();
reservationRouter.get('/', (req, res, next) => {

});

reservationRouter.post('/create', 
    // check('startDate').isISO8601().toDate(),
    // check('endDate').isISO8601().toDate(),
    (req, res, next) => {
        console.log("createReservation en router");
        console.log(req.body);
        console.log(req.session.userId);
        ctrl.createReservation(req, res, next);
    }
);

reservationRouter.post('/update', (req, res, next) => {
    
});

reservationRouter.post('/delete', (req, res, next) => {
    
});

reservationRouter.get('/byUser/:id', requireAdmin, ctrl.getReservationsByUser);

reservationRouter.get('/byFaculty/:id', requireAdmin, ctrl.getReservationsByFaculty);

reservationRouter.get('/userStats', requireAdmin, ctrl.getStatsByUser);

reservationRouter.get('/facultyStats', requireAdmin, ctrl.getStatsByFaculty);

module.exports = reservationRouter;