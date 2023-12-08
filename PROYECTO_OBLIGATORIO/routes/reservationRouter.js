"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const reservationsController = require('../controllers/reservationsController');
const controller = new reservationsController();
let reservationRouter = require('express').Router();

reservationRouter.get('/', (req, res, next) => {

});

reservationRouter.post('/create', (req, res, next) => {
    
});

reservationRouter.post('/update', (req, res, next) => {
    
});

reservationRouter.post('/delete', (req, res, next) => {
    
});

reservationRouter.get('/byUser/:id', requireAdmin, controller.getReservationsByUser);

reservationRouter.get('/byFaculty/:id', requireAdmin, controller.getReservationsByFaculty);

reservationRouter.get('/userStats', requireAdmin, controller.getStatsByUser);

reservationRouter.get('/facultyStats', requireAdmin, controller.getStatsByFaculty);

module.exports = reservationRouter;