"use strict";
let reservasRouter = require('express').Router();
const reservaController = require('../controllers/reservaController');
const controller = new reservaController();

const loginHandler = require('../middleware/login');

// anti-CSRF
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

//POST PARA LA RESERVA DEL USUARIO
reservasRouter.post("/create", loginHandler, controller.createReserva);

//POST PARA CANCELAR UNA RESERVA
reservasRouter.post('/delete', loginHandler, controller.cancelReserva);

//POST PARA CREAR UNA RESEÑA
reservasRouter.post('/review', loginHandler, controller.createComment);

module.exports = reservasRouter;