
const mysql = require("mysql");

class DAOReservations {
    pool;
    constructor(pool) {
        this.pool = pool;
    }

    getReservationById(id, callback) {
        this.pool.query(
            "SELECT * FROM ucm_aw_riu_res_reservations WHERE id = ?",
            [id],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    if (rows.length === 0) {
                        callback(null, null); // No reservation found with the given id
                    } else {
                        callback(null, rows[0]);
                    }
                }
            }
        );
    }

    getAllReservations(callback) {
        this.pool.query("SELECT * FROM ucm_aw_riu_res_reservations", (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    }

    createReservation(reservation, callback) {
        this.pool.query(
            "INSERT INTO ucm_aw_riu_res_reservations (userid, instid, dateini, dateend, datecreation) VALUES (?, ?, ?, ?, ?)",
            [
                reservation.userid,
                reservation.instid,
                reservation.dateini,
                reservation.dateend,
                reservation.datecreation,
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

    updateReservation(reservation, callback) {
        this.pool.query(
            "UPDATE ucm_aw_riu_res_reservations SET userid = ?, instid = ?, dateini = ?, dateend = ? WHERE id = ?",
            [
                reservation.userid,
                reservation.instid,
                reservation.dateini,
                reservation.dateend,
                reservation.id,
            ],
            (err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    }

    deleteReservation(id, callback) {
        this.pool.query(
            "DELETE FROM ucm_aw_riu_res_reservations WHERE id = ?",
            [id],
            (err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    }

    getReservationsByUser(userid, callback) {
        this.pool.query(
            "SELECT * FROM ucm_aw_riu_res_reservations WHERE userid = ?",
            [userid],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }

    getReservationsByInstallation(faculty, callback) {
        this.pool.query(
            "SELECT * FROM ucm_aw_riu_res_reservations WHERE instid = ?",
            [faculty],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }

}

module.exports = DAOReservations;
