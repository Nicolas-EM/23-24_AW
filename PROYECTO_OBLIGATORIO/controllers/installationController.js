"use strict";
const pool = require("../db/pool");
const DAOInstallations = require("../db/DAOInstallations");
const { validationResult } = require("express-validator");

const daoInstallations = new DAOInstallations(pool);

class installationController {
  getInstallations(req, res, next) {
    daoInstallations.getAllInstallations((err, installations) => {
      if (err) {
        next(err);
      } else {
        res.send(installations);
      }
    });
  }
  getImage(req, res, next) {
    const installationId = req.params.id;
    daoInstallations.getInstallationById(
      installationId,
      (err, installation) => {
        if (err) {
          next(err);
        } else {
          const imageBuffer = installation.image; // Assuming installation.image is a buffer containing the image data
          const imageBase64 = imageBuffer.toString("base64"); // Convert the buffer to base64 string
          const imageDataURI = `data:image/png;base64,${imageBase64}`; // Create a data URI with the base64 string

          res.send(imageDataURI);
        }
      }
    );
  }
}

module.exports = installationController;
