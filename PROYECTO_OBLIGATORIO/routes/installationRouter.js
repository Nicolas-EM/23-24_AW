"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');

let installationRouter = require('express').Router();

installationRouter.get('/', (req, res, next) => {
    
});

installationRouter.post('/create', requireAdmin, (req, res, next) => {
    
});

installationRouter.post('/update', requireAdmin, (req, res, next) => {
    
});

installationRouter.post('/delete', requireAdmin, (req, res, next) => {
    
});

installationRouter.post('/search', (req, res, next) => {
    
});

module.exports = installationRouter;