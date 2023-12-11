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

installationRouter.post("/create", requireAdmin, uploadDir.single("image"), (req, res, next) => {
    // Check if the request body contains the required fields
  check("name").notEmpty().withMessage("Name is required");
  check("faculty").notEmpty().withMessage("Faculty is required");
  check("capacity").notEmpty().withMessage("Capacity is required").isInt({ min: 1 }).withMessage("Capacity must be greater than 0");
  check("type").notEmpty().withMessage("Type is required");
//   console.log(req.body, req.file);
  installationCtrl.createInstallation(req, res, next);
});

installationRouter.post("/update", requireAdmin);

installationRouter.post("/delete", requireAdmin);

installationRouter.post("/search", installationCtrl.search);

installationRouter.get("/image/:id", installationCtrl.getImage);

module.exports = installationRouter;
