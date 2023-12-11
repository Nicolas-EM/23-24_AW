"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });
const requireAdmin = require('../middleware/requireAdmin');

const orgController = require('../controllers/orgController');
const controller = new orgController();

let orgRouter = require('express').Router();

orgRouter.get("/", controller.getFaculties);

orgRouter.get("/picture", controller.getPicture);

orgRouter.post("/picture", multerFactory.single("avatar"), controller.updatePicture);

orgRouter.post("/update", requireAdmin, controller.update);

module.exports = orgRouter;