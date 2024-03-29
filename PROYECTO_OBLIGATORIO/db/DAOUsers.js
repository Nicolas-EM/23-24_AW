const mysql = require("mysql");

class DAOUsers {
  pool;
  constructor(pool) {
    this.pool = pool;
  }

  getUserById(id, callback) {
    this.pool.query(
      "SELECT u.id, u.name, u.surname, u.facultyId, u.grade, u.ugroup, u.email, u.profileImage, u.isAdmin, u.isValidated, u.password, f.name AS facultyName FROM ucm_aw_riu_usu_users u JOIN ucm_aw_riu_ins_faculties f ON u.facultyId = f.id WHERE u.id = ?",
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
            callback({err: 400, message: "Error: User does not exist, please register."}); // No user found with the given email
          } else {
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

  updateUserRole(user, callback) {
    this.pool.query(
      "UPDATE ucm_aw_riu_usu_users SET isAdmin = ? WHERE id = ?",
      [
        user.isAdmin,
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

  getPicture(userId, callback) {
    this.pool.query(
      "SELECT profileImage FROM ucm_aw_riu_usu_users WHERE id = ?",
      [
        userId
      ],
      (err, row) => {
        if (err) {
          callback(err);
        } else {
          callback(null, row[0].profileImage);
        }
      }
    );
  }

  uploadPicture(userId, file, callback) {
    this.pool.query(
      "UPDATE ucm_aw_riu_usu_users SET profileImage = ? WHERE id = ?",
      [
        file.buffer,
        userId
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

  updateUser(user, callback) {
    this.pool.query(
      "UPDATE ucm_aw_riu_usu_users SET name = ?, surname = ?, email = ?, password = ? WHERE id = ?",
      [
        user.name,
        user.surname,
        user.email,
        user.password,
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

  searchUsers(query, isAdmin, isValidated, facultyId, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_usu_users WHERE (name LIKE ? OR surname LIKE ? OR email LIKE ?) AND isAdmin LIKE ? AND isValidated LIKE ? AND facultyId LIKE ?",
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${isAdmin}%`, `%${isValidated}%`, `%${facultyId}%`],
      (err, rows) => {
          if (err) {
              callback(err);
          } else {
              callback(null, rows);
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
      "INSERT INTO ucm_aw_riu_usu_users (name, surname, facultyId, grade, ugroup, email, password, profileImage, isAdmin, isValidated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.name,
        user.surname,
        user.facultyId,
        user.grade,
        user.ugroup,
        user.email,
        user.password,
        user.profileImage,
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

  getUserByFaculty(facultyId, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_usu_users WHERE facultyId = ?",
      [facultyId],
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
