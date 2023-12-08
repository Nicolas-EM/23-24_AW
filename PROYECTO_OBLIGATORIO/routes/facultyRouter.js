"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');

const FacultyController = require('../controllers/facultyController');
const facultyController = new FacultyController();

let facultyRouter = require('express').Router();

facultyRouter.get('/', facultyController.getFaculties);

facultyRouter.post('/create', requireAdmin, facultyController.createFaculty);

facultyRouter.post('/update', requireAdmin, facultyController.updateFaculty);

facultyRouter.post('/delete', requireAdmin, facultyController.deleteFaculty);

module.exports = facultyRouter;