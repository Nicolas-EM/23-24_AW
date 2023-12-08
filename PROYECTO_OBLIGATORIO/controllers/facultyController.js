"use strict";
const pool = require("../db/pool");
const DAOFaculty = require('../db/DAOFaculties');
const { validationResult } = require("express-validator");

const daoFaculty = new DAOFaculty(pool);

class FacultyController {

  getFaculties(req, res, next) {
    daoFaculty.getFaculties((err, faculties) => {
      if(err)
        next(err);
      else
        return res.json(faculties);
    })
  }

  createFaculty(req, res, next) {
    
  }

  updateFaculty(req, res, next) {
    // Handle the POST request for '/update'
  }

  deleteFaculty(req, res, next) {
    // Handle the POST request for '/delete'
  }
}

module.exports = FacultyController;
