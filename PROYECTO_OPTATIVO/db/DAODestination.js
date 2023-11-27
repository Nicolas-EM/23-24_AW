const mysql = require("mysql");

class DAODestination {
  pool;

  constructor(pool) {
    this.pool = pool;
  }

  getDestinos(callback) {
    this.pool.query(
      "SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.image_id) AS image_ids FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id GROUP BY d.id, d.nombre, d.descripcion, d.precio;",
      function (err, rows) {
        if (err) {
          callback(err);
        } else {
          if (rows && rows.length > 0) {
            // Assuming you are working with multiple rows, you should iterate over the rows
            rows.forEach((row) => {
              if (row.image_ids) {
                row.image_ids = row.image_ids.split(",");
              } else {
                // Handle the case where imagen_ids is undefined (no matching records)
                row.image_ids = [];
              }
            });
          }
          callback(null, rows);
        }
      }
    );
  }

  getComments(destino_id, callback) {
    this.pool.query("SELECT * FROM comentarios WHERE destino_id = ?;", [destino_id], function (err, rows) {
        if (err) {
          callback(err);
        } else {
          for (const row of rows) {
            const fechaComentario = new Date(row.fecha_comentario);
            const options = { year: "numeric", month: "long", day: "numeric" };
            row.fecha_comentario = fechaComentario.toLocaleDateString(
              "es-ES",
              options
            );
          }
          callback(null, rows);
        }
      }
    );
  }

  getDestinoById(id, callback) {
    this.pool.query("SELECT * FROM destinos WHERE id = ?;", [id], function (err, rows) {
        if (err) {
          callback(err);
        } else {
          let destino = rows[0];
          callback(null, destino);
        }
      }
    );
  }

  getDestinoImages(destino_id, callback) {
    this.pool.query("SELECT d.id, GROUP_CONCAT(di.image_id) AS image_ids FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id WHERE d.id = ? GROUP BY d.id;", [destino_id], function (err, rows) {
        if (err) {
          callback(err);
        } else {
          let image_ids = rows[0].image_ids;
          image_ids = image_ids.split(",");
          callback(null, image_ids);
        }
      }
    );
  }

  crearComentario(destino_id, nombre_usuario, comentario, puntuacion, callback) {
    // Assuming that there is a database connection object called `db`
    this.pool.query(
      "INSERT INTO comentarios (destino_id, nombre_usuario, comentario, puntuacion) VALUES (?, ?, ?, ?)",
      [destino_id, nombre_usuario, comentario, puntuacion],
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result.insertId);
        }
      }
    );
  }

  getSearch(search, minPrice, maxPrice, callback) {
    search = `%${search}%`;
    this.pool.query(
      "SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.image_id) AS image_ids " +
        "FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id WHERE d.nombre LIKE ? AND d.precio >= ? AND d.precio <= ? " +
        "GROUP BY d.id, d.nombre, d.descripcion, d.precio;",
      [search, minPrice, maxPrice],
      function (err, rows) {
        if (err) {
          callback(err);
        } else {
          if (rows && rows.length > 0) {
            // Iterate through the rows returned
            rows.forEach((row) => {
              if (row.image_ids) {
                row.image_ids = row.image_ids.split(",");
              } else {
                // Handle the case where imagen_ids is undefined (no matching records)
                row.image_ids = [];
              }
            });
          }
          callback(null, rows);
        }
      }
    );
  }

  isDestinoAvailable(reserva, callback) {
    this.pool.query(
      "SELECT COUNT(*) as numReservas FROM reservas WHERE fecha_start >= ? AND fecha_end <= ? AND destino_id = ?;",
      [reserva.startDate, reserva.endDate, reserva.destinoId],
      function (err, rows) {
        if (err) {
          callback(err);
        } else {
          if (rows && rows[0].numReservas == 0) callback(null, true);
          else callback(null, false);
        }
      }
    );
  }
}

module.exports = DAODestination;
