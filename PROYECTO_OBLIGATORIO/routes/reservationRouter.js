"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');

let reservationRouter = require('express').Router();

app.get('/', (req, res, next) => {

});

app.post('/create', (req, res, next) => {
    
});

app.post('/update', (req, res, next) => {
    
});

app.post('/delete', (req, res, next) => {
    
});

app.get('/byUser', requireAdmin, (req, res, next) => {
    
});

app.get('/byFaculty', requireAdmin, (req, res, next) => {
    
});

module.exports = reservationRouter;