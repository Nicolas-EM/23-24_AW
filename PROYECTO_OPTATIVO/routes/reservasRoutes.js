"use strict";
let reservasRouter = require('express').Router();
const reservaController = require('../controllers/reservaController');
const controller = new reservaController();

const loginHandler = require('../middleware/login');

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios

//POST PARA LA RESERVA DEL USUARIO
reservasRouter.post("/create", loginHandler, 
check("numPersonas").isInt({ min:  1}).withMessage("Error: Numero de personas no valido"),
controller.createReserva);

//POST PARA CANCELAR UNA RESERVA
reservasRouter.post('/delete', loginHandler, controller.cancelReserva);

//POST PARA CREAR UNA RESEÑA
reservasRouter.post('/review', loginHandler, controller.createComment);

// POST PARA ACTUALIZAR UNA RESERVA
reservasRouter.post('/update', loginHandler, controller.updateReserva);

module.exports = reservasRouter;