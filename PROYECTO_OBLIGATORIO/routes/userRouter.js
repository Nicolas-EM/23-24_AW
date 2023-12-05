"use strict";
const pool = require("../db/pool");
const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const requireLogin = require('../middleware/requireLogin');
const userController = require('../controllers/userController');
const userCtrl = new userController(pool);
let userRouter = require('express').Router();

userRouter.get('/', requireLogin, (req, res, next) => {
    res.status(200).render("user", { csrfToken: req.csrfToken() });
});

const { check, validationResult } = require("express-validator");

userRouter.post('/create',
    check('name').notEmpty().withMessage('Nombre es requerido'),
    check('surname').notEmpty().withMessage('Apellidos es requerido'),
    check('faculty').notEmpty().withMessage('Facultad es requerida'),
    check('grade').notEmpty().withMessage('Grado es requerido'),
    check('group').notEmpty().withMessage('Grupo es requerido'),
    check('email').notEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no válido'),
    check('password').notEmpty().withMessage('Contraseña es requerida')
        .isLength({ min: 7 }).withMessage('La contraseña debe tener al menos 7 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
, (req, res, next) => {
    userCtrl.register(req, res, next);
    // Continue with the rest of the code
});

userRouter.post('/update', requireLogin, (req, res, next) => {
    
});

userRouter.post('/login', (req, res, next) => {
    
});

userRouter.post('/logout', requireLogin, (req, res, next) => {
    
});

userRouter.post('/role', requireAdmin, (req, res, next) => {
    
});

userRouter.post('/validate', requireAdmin, (req, res, next) => {
    
});

userRouter.get('/byFaculty', requireAdmin, (req, res, next) => {
    
});

module.exports = userRouter;