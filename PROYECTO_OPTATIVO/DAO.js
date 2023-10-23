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
        console.log(id);
        this.pool.query("SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.image_id) AS image_ids FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id WHERE d.id = ? GROUP BY d.id, d.nombre, d.descripcion, d.precio", [id], function (err, rows) {
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

    createUser(user, callback) {
        this.pool.query("INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?);", [user.nombre, user.email, user.hashedPassword], function (err, OkPacket) {
            if (err) {
                callback(err);
            }
            else {
                console.log(OkPacket);
                if (OkPacket && OkPacket.insertId != undefined) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
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
    
    getReservas(email, callback){
        this.pool.query("SELECT d.nombre AS destino_nombre,d.descripcion AS destino_descripcion, di.image_id, di.img_description AS imagen_descripcion, r.fecha_start, r.fecha_end FROM reservas AS r INNER JOIN destinos AS d ON r.destino_id = d.id INNER JOIN destino_imagenes AS di ON d.id = di.destino_id INNER JOIN usuarios AS u ON r.cliente_id = u.id WHERE u.correo = ?;", [email], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                console.log(rows[0]);
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
                callback(null, rows[0]);
            }
        });
    }
}
module.exports = DAO;
