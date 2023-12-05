"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');

const FacultyController = require('../controllers/facultyController');
const facultyController = new FacultyController();

let facultyRouter = require('express').Router();

facultyRouter.get('/', (req, res, next) => {
    facultyController.getIndex(req, res, next);
});

facultyRouter.post('/create', requireAdmin, (req, res, next) => {
    facultyController.createFaculty(req, res, next);
});

facultyRouter.post('/update', requireAdmin, (req, res, next) => {
    facultyController.updateFaculty(req, res, next);
});

facultyRouter.post('/delete', requireAdmin, (req, res, next) => {
    facultyController.deleteFaculty(req, res, next);
});

module.exports = facultyRouter;