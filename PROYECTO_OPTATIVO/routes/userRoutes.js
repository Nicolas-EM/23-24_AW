"use strict";
let userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controller = new userController();
//EXPRESS VALIDATOR
const loginHandler = require('../middleware/login');

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// Multer
const multer = require("multer");
const uploadDir = multer({ dest: 'uploads/' });

//GET DE LA PAGINA DE USUARIO PERSONALIZADA
userRouter.get("/", loginHandler, controller.getUser);

//POST PARA EL METODO LOGIN DEL USUARIO
userRouter.post('/login',
check("email").trim().isEmail().withMessage("Formato de correo erróneo"),
check("password").trim().isLength({min: 7}).withMessage("Contraseña debe contener al menos siete caracteres"),
 controller.login);

//POST PARA EL METODO REGISTER DEL USUARIO
userRouter.post('/register', 
check("name").trim().notEmpty().withMessage("El nombre es un campo requerido"),
check("email").trim().isEmail().withMessage("Formato de correo erróneo"),
check("password").trim().isLength({ min: 7 }).matches(/\d/).withMessage("Tu contraseña debe tener al menos siete caracteres"),
controller.register);

//GET PARA CUANDO EL USUARIO SALE DE SESION Y REDIRIGE AL INDEX
userRouter.post('/logout', controller.logout);

// POST PARA SUBIR FOTO PERFIL
userRouter.post('/upload-picture', loginHandler, uploadDir.single('avatar'), controller.uploadPicture);

//POST PARA ACTUALIZAR USUARIO
//loginHandler porque son funciones que requieren que estes logeado para usarlas
userRouter.post('/update', loginHandler,
check("nombre").optional().trim(),
check("correo").optional().trim().isEmail().withMessage("Invalid email format"),
check("newPassword").optional().trim().isLength({ min: 7 }).withMessage("Password must be at least 7 characters long").matches(/\d/).withMessage("Password must contain at least one digit"),
check("currentPassword").trim().notEmpty().withMessage("Current password is required"),
check("userId").trim().notEmpty().withMessage("User ID is required"),
controller.update);


module.exports = userRouter;