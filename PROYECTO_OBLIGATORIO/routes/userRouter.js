"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
const userController = require("../controllers/userController");
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

// middleware login
const requireAdmin = require("../middleware/requireAdmin");
const requireLogin = require("../middleware/requireLogin");
let userRouter = require("express").Router();

const userCtrl = new userController();

userRouter.get("/", requireLogin, userCtrl.getAllUsers);

userRouter.get("/:id", requireLogin, userCtrl.getUserById);
userRouter.post("/create", multerFactory.single("picture"),
  check("name").notEmpty().withMessage("Name is required"),
    check("surname").notEmpty().withMessage("Surname is required"),
    check("faculty").notEmpty().withMessage("Faculty is required"),
    check("grade").notEmpty().withMessage("Grade is required"),
    check("group").notEmpty().withMessage("Group is required"),
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
    check("password").notEmpty().withMessage("Password is required"),
    userCtrl.register
);

userRouter.post(
  "/update",
  check("userId")
    .notEmpty()
    .withMessage("UserID required")
    .isNumeric()
    .withMessage("UserID must be numeric"),
  check("role")
    .notEmpty()
    .withMessage("Role required")
    .isNumeric()
    .withMessage("Role must be numeric"),
  requireLogin,
  userCtrl.updateUser
);

userRouter.post(
  "/login",
  check("email")
    .notEmpty()
    .withMessage("Email es requerido")
    .isEmail()
    .withMessage("Email no válido"),
  check("password").notEmpty().withMessage("Contraseña es requerida"),
  userCtrl.login
);

userRouter.post("/logout", requireLogin, userCtrl.logout);

userRouter.post(
  "/validate",
  check("userId")
    .notEmpty()
    .withMessage("UserID required")
    .isNumeric()
    .withMessage("UserID must be numeric"),
  requireAdmin,
  userCtrl.validateUser
);

userRouter.post(
  "/image",
  requireLogin,
  multerFactory.single("avatar"),
  userCtrl.uploadPicture
);

userRouter.get("/image/:id", requireLogin, userCtrl.getPicture);

userRouter.post("/search", requireLogin, userCtrl.searchUsers);

userRouter.get("/byFaculty/:id", requireLogin, userCtrl.getUsersByFaculty);

module.exports = userRouter;
