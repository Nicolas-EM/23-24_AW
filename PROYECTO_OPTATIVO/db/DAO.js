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

    getComments(destino_id, callback) {
        this.pool.query("SELECT * FROM comentarios WHERE destino_id = ?;", [destino_id], function (err, rows) {
            if (err) {
                callback(err);
            } else {
                for (const row of rows) {
                    const fechaComentario = new Date(row.fecha_comentario);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    row.fecha_comentario = fechaComentario.toLocaleDateString('es-ES', options);
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
    updateUserPicture(id, blob,callback) {
        this.pool.query("UPDATE usuarios SET fotoPerfil = ? WHERE id = ?;", [blob, id], function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(true);//TODO tenemos que redireccionar a user pero con la imagen cargada (ejs comprueba)
            }
        });
    }
    createUser(user, callback) {
        //por defecto comienza sin imagen de perfil
        this.pool.query("INSERT INTO usuarios (nombre, correo, password,fotoPerfil) VALUES (?, ?, ?, ?);", [user.name, user.email, user.hashedPassword, ""], function (err, OkPacket) {
            if (err) {
                callback(err);
            }
            else {
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
                if (rows && rows.length === 1)
                    callback(null, rows[0]);
                else if(rows.length === 0)
                    callback({status: 403, message: "Usuario no existe", stack: "getSingleUser()"});
                else
                    callback({status: 500, message: "Error sql", stack: "getSingleUser()"});
            }
        });
    }

    updateUser(user, callback) {
        //la query de update de la foto es diferente
        this.pool.query("UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?;", [user.newUsername, user.newEmail, user.newPwd, user.id], function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    getSingleUserById(id, callback) {
        this.pool.query("SELECT * FROM usuarios u WHERE u.id = ?;", [id], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                if (rows && rows.length == 1)
                    callback(null, rows[0]);
                else if(rows.length === 0)
                    callback({status: 403, message: "Usuario no existe", stack: "getSingleUserById()"});
                else
                    callback({status: 500, message: "Error sql", stack: "getSingleUserById()"});
            }
        });
    }

    crearComentario(destino_id, nombre_usuario, comentario, puntuacion, callback) {
        // Assuming that there is a database connection object called `db`
        this.pool.query(
            'INSERT INTO comentarios (destino_id, nombre_usuario, comentario, puntuacion) VALUES (?, ?, ?, ?)',
            [destino_id, nombre_usuario, comentario, puntuacion],
            function (err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result.insertId);
                }
            }
        );
    };

    getSearch(search, maxPrice, callback) {
        search = `%${search}%`;
        this.pool.query("SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.image_id) AS image_ids " +
            "FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id WHERE d.nombre LIKE ? AND d.precio <= ? " +
            "GROUP BY d.id, d.nombre, d.descripcion, d.precio;", [search, maxPrice], function (err, rows) {
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

    getReservas(cliente_id, callback) {
        this.pool.query("SELECT r.id AS reserva_id, r.cliente_id, r.fecha_start, r.fecha_end, r.reviewed , d.id AS destino_id, d.nombre AS destino_nombre, d.descripcion AS destino_descripcion, d.image_id AS destino_imagen_id, d.img_description AS destino_imagen_description FROM reservas r LEFT JOIN ( SELECT destinos.id, destinos.nombre, destinos.descripcion, destino_imagenes.image_id, destino_imagenes.img_description FROM destinos JOIN destino_imagenes ON destinos.id = destino_imagenes.destino_id WHERE destino_imagenes.image_id = (SELECT MIN(image_id) FROM destino_imagenes WHERE destino_id = destinos.id) ) d ON r.destino_id = d.id WHERE r.cliente_id = ? ORDER BY r.fecha_start DESC;", [cliente_id], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, rows);
            }
        });
    }

    getReservaById(reserva_id, callback) {
        this.pool.query("SELECT * FROM reservas WHERE id = ?;", [reserva_id], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, rows[0]);
            }
        });
    }

    getSingleReserva(cliente_id, reserva_id, callback) {
        this.pool.query("SELECT COUNT(*) as count FROM Reservas r WHERE r.id = ? AND r.cliente_id = ?;", [reserva_id, cliente_id], function (err, row) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, row[0].count === 1);
            }
        });
    }

    //para el metodo post de reserva (pendiente)
    borrarReserva(reserva_id, callback) {
        this.pool.query("DELETE FROM reservas WHERE id = ?;", [reserva_id], function (err, OkPacket) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, OkPacket.affectedRows);
            }
        });
    }

    isDestinoAvailable(reserva, callback) {
        this.pool.query("SELECT COUNT(*) as numReservas FROM reservas WHERE fecha_start >= ? AND fecha_end <= ? AND destino_id = ?;", [reserva.startDate, reserva.endDate, reserva.destinoId], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                if(rows && rows[0].numReservas == 0)
                    callback(null, true);
                else
                    callback(null, false);
            }
        });
    }

    createReserva(reserva, callback) {
        this.pool.query("INSERT INTO reservas (destino_id, cliente_id, fecha_start, fecha_end) VALUES (?, ?, ?, ?);", [reserva.destinoId, reserva.userId, reserva.startDate, reserva.endDate], function (err, OkPacket) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, OkPacket.insertId);
            }
        });
    }

    updateReservaReviewed(reserva_id, callback) {
        this.pool.query("UPDATE reservas SET reviewed = 1 WHERE id = ?;", [reserva_id], function (err, OkPacket) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, OkPacket.affectedRows);
            }
        });

    }
}

module.exports = DAO;