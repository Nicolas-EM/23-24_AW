"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const installationController = require("../controllers/installationController");

let installationRouter = require('express').Router();
const installationCtrl = new installationController();

installationRouter.get('/', installationCtrl.getInstallations);

installationRouter.post('/create', requireAdmin, (req, res, next) => {
    
});

installationRouter.post('/update', requireAdmin, (req, res, next) => {
    
});

installationRouter.post('/delete', requireAdmin, (req, res, next) => {
    
});

installationRouter.post('/search', (req, res, next) => {
    
});

installationRouter.get('/image/:id', (req, res, next) => {
    installationController.getImage(req, res, next);
});

module.exports = installationRouter;