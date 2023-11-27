"use strict";
let destinationRouter = require('express').Router();
const destinationController = require('../controllers/destinationController');
const controller = new destinationController();

// anti-CSRF
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// GET TODOS LOS DESTINOS
destinationRouter.get("/", controller.getDestinations);

//GET PARA LA WEB PERSONALIZADA DE CADA DESTINO
destinationRouter.get("/:id", controller.getSingleDestination);

//POST PARA LA BUSQUEDA
destinationRouter.post("/search", controller.searchDestinations);

module.exports = destinationRouter;