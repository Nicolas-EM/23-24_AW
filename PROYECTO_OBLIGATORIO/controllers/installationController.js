"use strict";

const { validationResult } = require("express-validator");

const pool = require("../db/pool");
const DAOInstallations = require("../db/DAOInstallations");
const DAOFaculties = require("../db/DAOFaculties");
const DAOUsers = require("../db/DAOUsers");
const daoInstallations = new DAOInstallations(pool);
const daoFaculties = new DAOFaculties(pool);
const daoUsers = new DAOUsers(pool);

class installationController {
  getInstallations(req, res, next) {
    daoUsers.getUserById(req.session.userId, (err, user) => {
      if (err)
        next(err);
      else {
        if (user.isValidated) {
          daoInstallations.getAllInstallations((err, installations) => {
            if (err) {
              next(err);
            } else {
              res.json(installations);
            }
          });
        } else {
          res.status(403).send("User is not validated");
        }
      }
    });
  }

  getSingleInstallation(req, res, next) {
    const installationId = req.params.id;

    daoInstallations.getInstallationById(installationId, (err, installation) => {
      if (err)
        next(err);
      else
        return res.send(installation);
    });
  }

  update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //422 Unprocessable Entity
    }

    const { installationId, name, capacity, type, faculty } = req.body;
    const image = req.file;

    let availability = "available";
    daoInstallations.updateInstallation(
      installationId,
      name,
      availability,
      type,
      capacity,
      image.buffer,
      faculty,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send("OK");
        }
      }
    );
  }

  search(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); //422 Unprocessable Entity
    }

    const { query, faculty, type, minCapacity } = req.body;

    daoInstallations.searchInstallation(
      query,
      faculty,
      type,
      minCapacity,
      (err, installations) => {
        if (err) {
          next(err);
        } else {
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

    const { name, capacity, type, faculty } = req.body;
    const image = req.file;

    daoFaculties.getFacultyById(faculty, (err, facultyObj) => {
      if (err) {
        next(err);
      } else {
        if (facultyObj) {
          let availability = "available";
          daoInstallations.createInstallation(
            name,
            availability,
            type,
            capacity,
            image.buffer,
            faculty,
            (err, id) => {
              if (err) {
                next(err);
              } else {
                res.json(id);
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
