"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const requireLogin = require('../middleware/requireLogin');
const reservationsController = require('../controllers/reservationsController');
const ctrl = new reservationsController();
let reservationRouter = require('express').Router();
const { isAfter, addHours } = require('date-fns');

reservationRouter.get('/', (req, res, next) => {

});

reservationRouter.post('/create', requireLogin, 
    check('startDate').isISO8601().toDate(),
    (req, res, next) => {
        ctrl.createReservation;
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