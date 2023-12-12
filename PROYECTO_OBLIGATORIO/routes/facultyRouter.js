"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');

const FacultyController = require('../controllers/facultyController');
const facultyController = new FacultyController();

let facultyRouter = require('express').Router();

facultyRouter.get('/', facultyController.getFaculties);

facultyRouter.post('/create', requireAdmin,
 check('facultyName').notEmpty().withMessage('Faculty name is required.'),
 facultyController.createFaculty);

facultyRouter.post('/update', requireAdmin, 
check('facultyName').notEmpty().withMessage('Faculty name is required.'),
check('facultyId').notEmpty().withMessage('Faculty ID is required.'),
facultyController.updateFaculty);

facultyRouter.post('/delete', requireAdmin, facultyController.deleteFaculty);

module.exports = facultyRouter;