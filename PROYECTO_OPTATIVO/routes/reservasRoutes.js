"use strict";
let reservasRouter = require('express').Router();
const reservaController = require('../controllers/reservaController');
const controller = new reservaController();

const loginHandler = require('../middleware/login');

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios

//POST PARA LA RESERVA DEL USUARIO
reservasRouter.post("/create", loginHandler, 
check("destinoId").isInt().withMessage("Se debe proporcionar un id de destino"),
check("numPersonas").isInt({ min:  1}).withMessage("Se debe proporcionar un número de personas mayor que 0"),
check("startDate").isDate().withMessage("Se debe proporcionar una fecha de comienzo"),
check("endDate").isDate().withMessage("Se debe proporcionar una fecha de fin"),
controller.createReserva);

//POST PARA CANCELAR UNA RESERVA
reservasRouter.post('/delete', loginHandler, controller.cancelReserva);

//POST PARA CREAR UNA RESEÑA
reservasRouter.post('/review',
check("reservaId").isInt().withMessage("Se debe proporcionar un id de reserva"),
check("rating").isInt({ min: 1, max: 5}).withMessage("Se debe proporcionar un número ranking entre 1 y 5"),
check("comment").isString().withMessage("Se debe proporcionar un texto comentario"),
loginHandler, controller.createComment);

// POST PARA ACTUALIZAR UNA RESERVA
reservasRouter.post('/update', loginHandler, 
check("reservaId").isInt().withMessage("Se debe proporcionar un id de reserva"),
check("numPersonas").isInt({ min:  1}).withMessage("Se debe proporcionar un número de personas mayor que 0"),
check("startDate").isDate().withMessage("Se debe proporcionar una fecha de comienzo"),
check("endDate").isDate().withMessage("Se debe proporcionar una fecha de fin"),
controller.updateReserva);

module.exports = reservasRouter;