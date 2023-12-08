const mysql = require("mysql");

class DAOUsers {
  pool;
  constructor(pool) {
    this.pool = pool;
  }

  getUserById(id, callback) {
    this.pool.query(
      "SELECT `id`, `name`, `surname`, `facultyId`, `grade`, `ugroup`, `email`, `profileImage`, `isAdmin`, `isValidated` FROM ucm_aw_riu_usu_users WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          if (rows.length === 0) {
            callback(null, null); // No user found with the given id
          } else {
            callback(null, rows[0]);
          }
        }
      }
    );
  }

  getUserByEmail(email, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_usu_users WHERE email = ?",
      [email],
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          if (rows.length === 0) {
            callback({err: 400, message: "User not found"}); // No user found with the given email
          } else {
            console.log(rows[0]);
            callback(null, rows[0]);
          }
        }
      }
    );
  }

  getAllUsers(callback) {
    this.pool.query("SELECT `id`, `name`, `surname`, `facultyId`, `grade`, `ugroup`, `email`, `profileImage`, `isAdmin`, `isValidated` FROM `ucm_aw_riu_usu_users`;", (err, rows) => {
      if (err) {
        callback(err);
      } else {
        callback(null, rows);
      }
    });
  }

  //se puede actualizar solo algun dato, eso lo separaremos en otra query.
  updateUser(user, callback) {
    this.pool.query(
      "UPDATE ucm_aw_riu_usu_users SET name = ?, surname = ?, faculty = ?, grade = ?, ugroup = ?, email = ?, password = ?, profileImageName = ?, profileImageType = ?, isAdmin = ?, isValidated = ? WHERE id = ?",
      [
        user.name,
        user.surname,
        user.faculty,
        user.grade,
        user.ugroup,
        user.email,
        user.password,
        user.profileImageName,
        user.profileImageType,
        user.isAdmin,
        user.isValidated,
        user.id,
      ],
      (err, result) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  }

  validateUser(id, callback){
    this.pool.query(
      "UPDATE ucm_aw_riu_usu_users SET isValidated = 1 WHERE id = ?",
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

  deleteUser(id, callback) {
    this.pool.query(
      "DELETE FROM ucm_aw_riu_usu_users WHERE id = ?",
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

  createUser(user, callback) {
    this.pool.query(
      "INSERT INTO ucm_aw_riu_usu_users (name, surname, faculty, grade, ugroup, email, password, profileImageName, profileImageType, isAdmin, isValidated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.name,
        user.surname,
        user.faculty,
        user.grade,
        user.ugroup,
        user.email,
        user.password,
        user.profileImageName,
        user.profileImageType,
        user.isAdmin,
        user.isValidated,
      ],
      (err, result) => {
        if (err) {
          callback(err);
        } else {
          callback(null, result.insertId);
        }
      }
    );
  }

  getUserByFaculty(faculty, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_usu_users WHERE faculty = ?",
      [faculty],
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          if (rows.length === 0) {
            callback(null, null); // No user found with the given faculty
          } else {
            callback(null, rows);
          }
        }
      }
    );
  }
}

module.exports = DAOUsers;
