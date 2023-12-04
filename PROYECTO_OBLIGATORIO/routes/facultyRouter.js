"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');

let facultyRouter = require('express').Router();

app.get('/', (req, res, next) => {
    
});

app.post('/create', requireAdmin, (req, res, next) => {
    
});

app.post('/update', requireAdmin, (req, res, next) => {
    
});

app.post('/delete', requireAdmin, (req, res, next) => {
    
});

module.exports = facultyRouter;