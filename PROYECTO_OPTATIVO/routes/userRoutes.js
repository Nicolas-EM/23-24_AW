"use strict";
let userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controller = new userController();

const loginHandler = require('../middleware/login');

// Multer
const multer = require("multer");
const uploadDir = multer({ dest: 'uploads/' });

// anti-CSRF
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


//GET DE LA PAGINA DE USUARIO PERSONALIZADA
userRouter.get("/", loginHandler, controller.getUser);

//POST PARA EL METODO LOGIN DEL USUARIO
userRouter.post('/login', controller.login);

//POST PARA EL METODO REGISTER DEL USUARIO
userRouter.post('/register', controller.register);

//GET PARA CUANDO EL USUARIO SALE DE SESION Y REDIRIGE AL INDEX
userRouter.post('/logout', controller.logout);

// POST PARA SUBIR FOTO PERFIL
userRouter.post('/upload-picture', uploadDir.single('avatar'), controller.uploadPicture);

//POST PARA ACTUALIZAR USUARIO
userRouter.post('/update', loginHandler, controller.update);


module.exports = userRouter;