const mysql = require('mysql');

class DAO {
    pool;

    constructor(pool) {
        this.pool = pool;
    }

    getDestinos(callback) {
        this.pool.query("SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.image_id) AS image_ids FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id GROUP BY d.id, d.nombre, d.descripcion, d.precio;", function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                if (rows && rows.length > 0) {
                    // Assuming you are working with multiple rows, you should iterate over the rows
                    rows.forEach(row => {
                        if (row.image_ids) {
                            row.image_ids = row.image_ids.split(',');
                        } else {
                            // Handle the case where imagen_ids is undefined (no matching records)
                            row.image_ids = [];
                        }
                    });
                }
                callback(null, rows);
            }
        });
    }

    getDestinoById(id, callback) {
        this.pool.query("SELECT * FROM destinos WHERE id = ?;", [id], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                let destino = rows[0];
                callback(null, destino);
            }
        });
    }

    getDestinoImages(destino_id, callback) {
        this.pool.query("SELECT d.id, GROUP_CONCAT(di.image_id) AS image_ids FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id WHERE d.id = ? GROUP BY d.id;", [destino_id], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                let image_ids = rows[0].image_ids;
                image_ids = image_ids.split(',');
                callback(null, image_ids);
            }
        });
    }

    createUser(user, callback) {
        this.pool.query("INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?);", [user.nombre, user.email, user.hashedPassword], function (err, OkPacket) {
            if (err) {
                callback(err);
            }
            else {
                console.log(OkPacket);
                callback(null, OkPacket.insertId);
            }
        });
    }

    getSingleUser(email, callback) {
        this.pool.query("SELECT * FROM usuarios u WHERE u.correo = ?;", [email], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                if (rows && rows.length == 1)
                    callback(null, rows[0]);
                else
                    callback("getSingleUser: Multiple users found");
            }
        });
    }

    getSearch(search, filter, callback) {
        console.log(search,filter);
        search = `%${search}%`;
        this.pool.query("SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.image_id) AS image_ids " +
            "FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id WHERE d.nombre LIKE ? AND d.precio < ? " +
            "GROUP BY d.id, d.nombre, d.descripcion, d.precio;", [search, filter], function (err, rows) {
                if (err) {
                    callback(err);
                } else {
                    if (rows && rows.length > 0) {
                        // Iterate through the rows returned
                        rows.forEach(row => {
                            if (row.image_ids) {
                                row.image_ids = row.image_ids.split(',');
                            } else {
                                // Handle the case where imagen_ids is undefined (no matching records)
                                row.image_ids = [];
                            }
                        });
                    }
                    callback(null, rows);
                }
            });
    }
    
    getReservas(cliente_id, callback){
        this.pool.query("SELECT r.id AS reserva_id, r.cliente_id, r.fecha_start, d.id AS destino_id, d.nombre AS destino_nombre, d.descripcion AS destino_descripcion, d.image_id AS destino_imagen_id, d.img_description AS destino_imagen_description FROM reservas r LEFT JOIN ( SELECT destinos.id, destinos.nombre, destinos.descripcion, destino_imagenes.image_id, destino_imagenes.img_description FROM destinos JOIN destino_imagenes ON destinos.id = destino_imagenes.destino_id WHERE destino_imagenes.image_id = (SELECT MIN(image_id) FROM destino_imagenes WHERE destino_id = destinos.id) ) d ON r.destino_id = d.id WHERE r.cliente_id = ?;", [cliente_id], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, rows);
            }
        });
    }
}
module.exports = DAO;
