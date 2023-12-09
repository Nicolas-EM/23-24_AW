"use strict";
const pool = require("../db/pool");
const DAOFaculty = require('../db/DAOFaculties');
const { validationResult } = require("express-validator");

const daoF = new DAOFaculty(pool);

class FacultyController {

  getFaculties(req, res, next) {
    daoF.getFaculties((err, faculties) => {
      if(err)
        next(err);
      else
        return res.json(faculties);
    })
  }

  createFaculty(req, res, next) {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ errors: validationResult(req).array() });
    }
    else{
      const name = req.body.facultyName;
      daoF.createFaculty(name, (err) => {
        if(err)
          next(err);
        else
          res.send("OK");
      });
    }
  }

  updateFaculty(req, res, next) {
    // Handle the POST request for '/update'
  }

  deleteFaculty(req, res, next) {
    // Handle the POST request for '/delete'
  }
}

module.exports = FacultyController;
