"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios

let destinationRouter = require('express').Router();
const destinationController = require('../controllers/destinationController');
const controller = new destinationController();

// GET TODOS LOS DESTINOS
destinationRouter.get("/", controller.getDestinations);

//GET PARA LA WEB PERSONALIZADA DE CADA DESTINO
destinationRouter.get("/:id", controller.getSingleDestination);

//POST PARA LA BUSQUEDA
destinationRouter.post("/search",
    check("minPrice").isInt({ min: 0 }).optional().withMessage("Precio mínimo debe ser un número mayor que 0"),
    check("maxPrice").isInt().custom((value, { req }) => value > req.body.minPrice).withMessage("El precio maximo debe ser mayor al mínimo"),
  controller.searchDestinations);

module.exports = destinationRouter;