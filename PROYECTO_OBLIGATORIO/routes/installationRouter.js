"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require("../middleware/requireAdmin");
const installationController = require("../controllers/installationController");
let installationRouter = require("express").Router();
const installationCtrl = new installationController();
const multer = require("multer");
const uploadDir = multer({ storage: multer.memoryStorage() });

installationRouter.get("/", installationCtrl.getInstallations);

installationRouter.get("/:id", installationCtrl.getSingleInstallation);

installationRouter.post("/create", requireAdmin, uploadDir.single("image"),
  check("name").notEmpty().withMessage("Name is required"),
  check("faculty").notEmpty().withMessage("Faculty is required"),
  check("capacity").notEmpty().withMessage("Capacity is required").isInt({ min: 1 }).withMessage("Capacity must be greater than 0"),
  check("type").notEmpty().withMessage("Type is required"),
  installationCtrl.createInstallation);

installationRouter.post("/update", requireAdmin, uploadDir.single("image"),
  check("installationId").notEmpty().withMessage("InstallationId is required").isInt({min: 1}).withMessage("InstallationId must be greater than 0"),
  check("name").notEmpty().withMessage("Name is required"),
  check("faculty").notEmpty().withMessage("Faculty is required"),
  check("capacity").notEmpty().withMessage("Capacity is required").isInt({ min: 1 }).withMessage("Capacity must be greater than 0"),
  check("type").notEmpty().withMessage("Type is required"),
  installationCtrl.update);

installationRouter.post("/delete", requireAdmin);

installationRouter.post("/search", installationCtrl.search);

installationRouter.get("/image/:id", installationCtrl.getImage);

module.exports = installationRouter;
