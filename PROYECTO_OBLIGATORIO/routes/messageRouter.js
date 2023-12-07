"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios

let messageRouter = require('express').Router();

messageRouter.get('/', (req, res, next) => {
    
});

messageRouter.post('/send', (req, res, next) => {
    
});

module.exports = messageRouter;