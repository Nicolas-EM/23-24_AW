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

reservationRouter.get('/byUser', requireAdmin, controller.getReservationsByUser);

reservationRouter.get('/byFaculty', requireAdmin, controller.getReservationsByFaculty);

module.exports = reservationRouter;