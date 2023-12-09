"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const installationController = require("../controllers/installationController");
let installationRouter = require('express').Router();
const installationCtrl = new installationController();

installationRouter.get('/', installationCtrl.getInstallations);

installationRouter.post('/create', requireAdmin, );

installationRouter.post('/update', requireAdmin, );

installationRouter.post('/delete', requireAdmin, );

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
    installationCtrl.search
);

installationRouter.get('/image/:id', installationCtrl.getImage);

module.exports = installationRouter;