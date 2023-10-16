const mysql = require('mysql');
class DAO {
    pool;

    constructor(pool) {
        this.pool = pool;
    }

    getDestinos(callback) {
        this.pool.query("SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.imagen_name) AS imagen_names FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id GROUP BY d.id, d.nombre, d.descripcion, d.precio;", function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                if (rows && rows.length > 0) {
                    // Assuming you are working with multiple rows, you should iterate over the rows
                    rows.forEach(row => {
                        if (row.imagen_names) {
                            row.imagen_names = row.imagen_names.split(',');
                        } else {
                            // Handle the case where imagen_ids is undefined (no matching records)
                            row.imagen_names = [];
                        }
                    });
                }
                callback(null, rows);
            }
        });
    }

    getDestinoById(id, callback) {
        console.log(id);
        this.pool.query("SELECT d.id, d.nombre, d.descripcion, d.precio, GROUP_CONCAT(di.imagen_name) AS imagen_names FROM destinos d LEFT JOIN destino_imagenes di ON d.id = di.destino_id WHERE d.id = ? GROUP BY d.id, d.nombre, d.descripcion, d.precio", [id], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                if (rows && rows.length > 0) {
                    // Assuming you are working with multiple rows, you should iterate over the rows
                    rows.forEach(row => {
                        if (row.imagen_names) {
                            row.imagen_names = row.imagen_names.split(',');
                        } else {
                            // Handle the case where imagen_ids is undefined (no matching records)
                            row.imagen_names = [];
                        }
                    });
                }
                callback(null, rows);
            }
        });
    }


    // async function getDestinosById(id, con) {
    //     try {

    //         con = await pool.getConnection();
    //         const row = await con.query('SELECT * FROM destinos WHERE id = ?', [id]);
    //         return row;
    //     } catch (err) {
    //         throw err;
    //     } finally {
    //         if (con) con.release();
    //     }
    // }

    // async function createUser(user, con) {
    //     try {
    //         con = await pool.getConnection();
    //         const existingUser = await con.query('SELECT * FROM users WHERE correo = ?', [user.correo]);
    //         if (existingUser.length > 0) {
    //             throw new Error('El usuario ya existe!');
    //         }
    //         const result = await con.query('INSERT INTO users (nombre, correo, passwd) VALUES (?, ?, ?)', [user.nombre, user.correo, user.passd]);
    //         return result;
    //     } catch (err) {
    //         throw err;
    //     } finally {
    //         if (con) con.release();
    //     }
    // }
    //  function createReserve(res, con) {
    //     try {
    //         con =  pool.getConnection();
    //         let existingReserve = await con.query('SELECT * FROM reservas WHERE destino_id = ? AND nombre_cliente = ? AND correo_cliente = ? AND fecha_reserva = ?', [res.destino_id, res.nombre_cliente, res.correo_cliente, res.fecha_reserva]);
    //         if (existingReserve.length > 0) {
    //             throw new Error('La reserva solicitada ya existe!');
    //         }
    //         const result = await con.query('INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?, ?, ?, ?)', [res.destino_id, res.nombre_cliente, res.correo_cliente, res.fecha_reserva]);
    //         return result;
    //     } catch (err) {
    //         throw err;
    //     } finally {
    //         if (con) con.release();
    //     }
    // }
}
module.exports = DAO;
