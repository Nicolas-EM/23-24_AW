
const mysql = require("mysql");

class DAOReservations {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    createReservation(reservation, callback) {
        console.log(reservation);
        this.pool.query(
            "INSERT INTO ucm_aw_riu_res_reservations (dateini,dateend,datecreation,userid,instid) VALUES (?, ?, ?, ?, ?)",
            [
                reservation.dateini,
                reservation.dateend,
                reservation.datecreation,
                reservation.userid,
                reservation.instid,
            ],(err, result) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result.insertId);
                }
            }
        );
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
    checkReservation(day, instid, callback) {
        console.log(day, instid);
        this.pool.query(
            "SELECT CONCAT(HOUR(dateini), '-', HOUR(dateini) + 1) AS `Time Slot`,COUNT(*) AS `numReservations`FROM ucm_aw_riu_res_reservations WHERE DATE(dateini) = ? AND instid = ? GROUP BY HOUR(dateini) ORDER BY HOUR(dateini);",
            [day, instid],(err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }
    getNumReservasInDay(day, instid,callback){
        this.pool.query("SELECT COUNT(*) AS reservation_count FROM ucm_aw_riu_res_reservations WHERE DATE(dateini) = ? AND instid = ?;",[day,instid],(err,rows)=>{
            if(err){
                callback(err);
            }
            else{
                if (rows.length === 1) {
                    callback(null,rows[0]);
                }
                else{
                    //ha habido un error
                    callback("error: numero incorrecto para query getNumReservasInDay");
                }
            }
        });
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
