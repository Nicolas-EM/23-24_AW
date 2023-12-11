const mysql = require("mysql");

class DAOInstallations {
  pool;
  constructor(pool) {
    this.pool = pool;
  }

  getInstallationById(id, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_ins_installations WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          if (rows.length === 0) {
            callback(null, null); // No installation found with the given id
          } else {
            callback(null, rows[0]);
          }
        }
      }
    );
  }
  getAllInstallations(callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_ins_installations",
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          callback(null, rows);
        }
      }
    );
  }

  deleteFacility(id, callback) {
    this.pool.query(
      "DELETE FROM ucm_aw_riu_ins_installations WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  }

  searchInstallation(name, faculty, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_ins_installations WHERE name LIKE ? AND facultyId LIKE ?",
      [`%${name}%`, `%${faculty}%`],
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          callback(null, rows);
        }
      }
    );
  }

  createInstallation(name, availability, type, capacity, image, faculty, callback) {
    console.log("dao", name, availability, type, capacity, faculty, image);
    this.pool.query(
      "INSERT INTO ucm_aw_riu_ins_installations (name, availabity, type, capacity, image, facultyId) VALUES (?, ?, ?, ?, ?, ?)",
      [name,availability,type, capacity, image, faculty],
      (err) => {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          console.log("no hay error");
          callback(null);
        }
      }
    );
  }
}
module.exports = DAOInstallations;
