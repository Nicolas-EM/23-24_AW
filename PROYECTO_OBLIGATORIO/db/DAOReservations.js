
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

    getReservationsStatsByUser(callback) {
        this.pool.query(
            "SELECT u.name as name, COUNT(r.id) AS ReservationCount, MIN(r.dateini) AS EarliestReservation, MAX(r.dateend) AS LatestReservation FROM ucm_aw_riu_usu_users u JOIN ucm_aw_riu_res_reservations r ON u.id = r.userid GROUP BY u.id, u.name;",
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }

    getReservationsStatsByFaculty(callback) {
        this.pool.query(
            "SELECT f.name AS name, COUNT(r.id) AS ReservationCount, MIN(r.dateini) AS EarliestReservation, MAX(r.dateend) AS LatestReservation FROM ucm_aw_riu_ins_faculties f JOIN ucm_aw_riu_ins_installations i ON f.id = i.facultyId JOIN ucm_aw_riu_res_reservations r ON i.id = r.instid GROUP BY f.id, f.name;",
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
