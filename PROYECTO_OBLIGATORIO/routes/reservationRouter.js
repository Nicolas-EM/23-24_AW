"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');

let reservationRouter = require('express').Router();

reservationRouter.get('/', (req, res, next) => {

});

reservationRouter.post('/create', (req, res, next) => {
    
});

reservationRouter.post('/update', (req, res, next) => {
    
});

reservationRouter.post('/delete', (req, res, next) => {
    
});

reservationRouter.get('/byUser', requireAdmin, (req, res, next) => {
    
});

reservationRouter.get('/byFaculty', requireAdmin, (req, res, next) => {
    
});

module.exports = reservationRouter;