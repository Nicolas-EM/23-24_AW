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

installationRouter.post('/search',
    check("query").notEmpty().withMessage("El campo de búsqueda no puede estar vacío"),
    // check("minPrice").notEmpty().withMessage("El campo minPrice no puede estar vacío").custom((value, { req }) => {
    //     if (value < 0) {
    //         throw new Error("El campo minPrice no puede ser negativo");
    //     }
    //     if (value >= req.body.maxPrice) {
    //         throw new Error("El campo minPrice debe ser menor que maxPrice");
    //     }
    //     return true;
    // }),
    // check("maxPrice").notEmpty().withMessage("El campo maxPrice no puede estar vacío").custom((value, { req }) => {
    //     if (value < 0) {
    //         throw new Error("El campo maxPrice no puede ser negativo");
    //     }
    //     if (value <= req.body.minPrice) {
    //         throw new Error("El campo maxPrice debe ser mayor que minPrice");
    //     }
    //     return true;
    // }),
    (req, res, next) => {
        console.log("req.body: ", req.body);
        installationCtrl.search(req, res, next); 
    }
);

installationRouter.get('/image/:id', (req, res, next) => {
    installationCtrl.getImage(req, res, next);
});
module.exports = installationRouter;