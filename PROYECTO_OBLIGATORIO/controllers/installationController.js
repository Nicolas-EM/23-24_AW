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
        res.json(installations);
      }
    });
  }

  search(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //422 Unprocessable Entity
    }
    daoInstallations.searchInstallation(
      req.body.query,
      // req.body.maxPrice,
      // req.body.minPrice,
      (err, installations) => {
        if (err) {
          next(err);
        } else {
          //TODO no se que es mejor si json o send
          console.log(installations);
          res.json(installations);
        }
      }
    );
  }

  getImage(req, res, next) {
    const installationId = req.params.id;

    daoInstallations.getInstallationById(installationId, (err, installation) => {
      if (err) {
        next(err);
      } else {
        console.log(installation.image);
        if(installation.image != null){
          res.end(installation.image);
        } else {
          res.status(404).end("Not found");
        }
      }
    });
  }
}

module.exports = installationController;
