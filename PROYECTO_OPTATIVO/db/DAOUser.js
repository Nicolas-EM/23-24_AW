const mysql = require("mysql");

class DAOUser {
  pool;

  constructor(pool) {
    this.pool = pool;
  }

  updateUserPicture(id, filename, mimetype, callback) {
      this.pool.query(
          "UPDATE usuarios SET fotoFilename = ?, fotoMimetype = ? WHERE id = ?;",
          [filename, mimetype, id],
          function (err, result) {
              if (err) {
                  callback(err);
              } else {
                  callback(null);
              }
          }
      );
  }

  createUser(user, callback) {
    //por defecto comienza sin imagen de perfil
    this.pool.query(
      "INSERT INTO usuarios (nombre, correo, password, fotoFilename, fotoMimetype) VALUES (?, ?, ?, ?, ?);",
      [user.name, user.email, user.hashedPassword, "", ""],
      function (err, OkPacket) {
        if (err) {
          callback(err);
        } else {
          callback(null, OkPacket.insertId);
        }
      }
    );
  }

  getSingleUser(id, callback) {
    this.pool.query(
      "SELECT * FROM usuarios u WHERE u.id = ?;",
      [id],
      function (err, rows) {
        if (err) {
          callback(err);
        } else {
          if (rows && rows.length === 1) callback(null, rows[0]);
          else if (rows.length === 0)
            callback({
              status: 403,
              message: "Usuario no existe",
              stack: "getSingleUser()",
            });
          else
            callback({
              status: 500,
              message: "Error sql",
              stack: "getSingleUser()",
            });
        }
      }
    );
  }
  
  getSingleUserByEmail(email, callback) {
    this.pool.query(
      "SELECT * FROM usuarios u WHERE u.correo = ?;",
      [email],
      function (err, rows) {
        if (err) {
          callback(err);
        } else {
          if (rows && rows.length === 1) callback(null, rows[0]);
          else if (rows.length === 0)
            callback({
              status: 403,
              message: "Usuario no existe",
              stack: "getSingleUser()",
            });
          else
            callback({
              status: 500,
              message: "Error sql",
              stack: "getSingleUser()",
            });
        }
      }
    );
  }
  
  updateUser(user, callback) {
    //la query de update de la foto es diferente
    this.pool.query(
      "UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?;",
      [user.newUsername, user.newEmail, user.newPwd, user.userId],
      function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  }

  getSingleUserById(id, callback) {
    this.pool.query(
      "SELECT * FROM usuarios u WHERE u.id = ?;",
      [id],
      function (err, rows) {
        if (err) {
          callback(err);
        } else {
          if (rows && rows.length == 1) callback(null, rows[0]);
          else if (rows.length === 0)
            callback({
              status: 403,
              message: "Usuario no existe",
              stack: "getSingleUserById()",
            });
          else
            callback({
              status: 500,
              message: "Error sql",
              stack: "getSingleUserById()",
            });
        }
      }
    );
  }
}

module.exports = DAOUser;
