"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
const userController = require('../controllers/userController');

// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const requireLogin = require('../middleware/requireLogin');

let userRouter = require('express').Router();

const userCtrl = new userController();

userRouter.get('/', requireLogin, userCtrl.getAllUsers);

userRouter.get('/:id', requireLogin, userCtrl.getUserById);

userRouter.post('/create',
    check('name').notEmpty().withMessage('Nombre es requerido'),
    check('surname').notEmpty().withMessage('Apellidos es requerido'),
    check('faculty').notEmpty().withMessage('Facultad es requerida'),
    check('grade').notEmpty().withMessage('Grado es requerido'),
    check('group').notEmpty().withMessage('Grupo es requerido'),
    check('email').notEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no válido'),
    check('password').notEmpty().withMessage('Contraseña es requerida')
        .isLength({ min: 7 }).withMessage('La contraseña debe tener al menos 7 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número'), 
    userCtrl.register);

userRouter.post('/update', requireLogin, (req, res, next) => {

});

userRouter.post('/login',
    check('email').notEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no válido'),
    check('password').notEmpty().withMessage('Contraseña es requerida'),
    userCtrl.login);

userRouter.post('/logout', requireLogin, userCtrl.logout);

userRouter.post('/role', requireAdmin, (req, res, next) => {

});

userRouter.post('/validate', requireAdmin, (req, res, next) => {

});

userRouter.get('/byFaculty', requireAdmin, (req, res, next) => {

});

module.exports = userRouter;