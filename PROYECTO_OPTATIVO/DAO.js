const mysql = require('mysql');
const bcrypt = require('bcrypt');

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

    authUser(user, callback){
        console.log(user);
        this.pool.query("SELECT * FROM usuarios u WHERE u.correo = ?;", [user.email], function (err, rows) {
            if (err) {
                callback(err);
            }
            else {
                console.log(rows);
                if (rows && rows.length > 0) {
                    const row = rows[0];
                    bcrypt.compare(user.password, row.password, callback);
                } else{
                    callback(null, false);
                }
            }
        });
    }

    createUser(user, callback){
        // Create hasher
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(user.password, salt);

        this.pool.query("INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?);", [user.nombre, user.email, hashedPassword], function (err, OkPacket) {
            if (err) {
                callback(err);
            }
            else {
                console.log(OkPacket);
                if (OkPacket && OkPacket.insertId != undefined) {
                    callback(null, true);   
                } else{
                    callback(null, false);
                }
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
