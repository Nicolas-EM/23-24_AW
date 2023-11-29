const mysql = require("mysql");

class DAOReservas {
  pool;

  constructor(pool) {
    this.pool = pool;
  }

  getReservas(cliente_id, callback) {
    this.pool.query(
      "SELECT r.id AS reserva_id, r.cliente_id, r.fecha_start, r.fecha_end, r.reviewed , d.id AS destino_id, d.nombre AS destino_nombre, d.descripcion AS destino_descripcion, d.image_id AS destino_imagen_id, d.img_description AS destino_imagen_description FROM reservas r LEFT JOIN ( SELECT destinos.id, destinos.nombre, destinos.descripcion, destino_imagenes.image_id, destino_imagenes.img_description FROM destinos JOIN destino_imagenes ON destinos.id = destino_imagenes.destino_id WHERE destino_imagenes.image_id = (SELECT MIN(image_id) FROM destino_imagenes WHERE destino_id = destinos.id) ) d ON r.destino_id = d.id WHERE r.cliente_id = ? ORDER BY r.fecha_start DESC;",
      [cliente_id],
      function (err, rows) {
        if (err) {
          callback(err);
        } else {
          callback(null, rows);
        }
      }
    );
  }

  getReservaById(reserva_id, callback) {
    this.pool.query(
      "SELECT * FROM reservas WHERE id = ?;",
      [reserva_id],
      function (err, rows) {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          console.log(rows);
          callback(null, rows[0]);
        }
      }
    );
  }

  getSingleReserva(cliente_id, reserva_id, callback) {
    console.log(cliente_id, reserva_id);
    this.pool.query(
      "SELECT COUNT(*) as count FROM Reservas r WHERE r.id = ? AND r.cliente_id = ?;",
      [reserva_id, cliente_id],
      function (err, row) {
        if (err) {
          callback(err);
        } else {
          console.log(row);
          callback(null, row[0].count === 1);
        }
      }
    );
  }

  borrarReserva(reserva_id, callback) {
    this.pool.query(
      "DELETE FROM reservas WHERE id = ?;",
      [reserva_id],
      function (err, OkPacket) {
        if (err) {
          callback(err);
        } else {
          callback(null, OkPacket.affectedRows);
        }
      }
    );
  }

  createReserva(reserva, callback) {
    this.pool.query(
      "INSERT INTO reservas (destino_id, cliente_id, fecha_start, fecha_end) VALUES (?, ?, ?, ?);",
      [reserva.destinoId, reserva.userId, reserva.startDate, reserva.endDate],
      function (err, OkPacket) {
        if (err) {
          callback(err);
        } else {
          callback(null, OkPacket.insertId);
        }
      }
    );
  }

  updateReservaReviewed(reserva_id, callback) {
    this.pool.query(
      "UPDATE reservas SET reviewed = 1 WHERE id = ?;",
      [reserva_id],
      function (err, OkPacket) {
        if (err) {
          callback(err);
        } else {
          callback(null, OkPacket.affectedRows);
        }
      }
    );
  }

  updateReserva(data, callback){
    this.pool.query("UPDATE reservas SET fecha_start = ?, fecha_end = ? WHERE id = ?;", [data.startDate, data.endDate, data.reservaId], function (err, OkPacket) {
        if (err) {
          callback(err);
        } else {
          callback(null, OkPacket.affectedRows);
        }
      }
    );
  }
}

module.exports = DAOReservas;
