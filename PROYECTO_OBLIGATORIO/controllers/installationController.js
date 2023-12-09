"use strict";

const { validationResult } = require("express-validator");

const pool = require("../db/pool");
const DAOInstallations = require("../db/DAOInstallations");
const DAOFaculties = require("../db/DAOFaculties");
const daoInstallations = new DAOInstallations(pool);
const daoFaculties = new DAOFaculties(pool);

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

    const { query, faculty } = req.body;

    daoInstallations.searchInstallation(
      query,
      faculty,
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
  createInstallation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //422 Unprocessable Entity
    }

    const { image, name, capacity, type, faculty } = req.body;
    daoFaculties.getFacultyById(faculty, (err, faculty) => {
      if (err) {
        next(err);
      } else {
        if (faculty) {
          daoInstallations.createInstallation(
            name,
            faculty,
            capacity,
            type,
            image,
            (err, result) => {
              if (err) {
                next(err);
              } else {
                res.send("OK");
              }
            }
          );
        } else {
          res.status(404).end("Faculty not found");
        }
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
          if (installation.image != null) {
            res.end(installation.image);
          } else {
            res.status(404).end("Not found");
          }
        }
      }
    );
  }
}

module.exports = installationController;
