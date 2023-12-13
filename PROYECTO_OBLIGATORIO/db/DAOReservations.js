const mysql = require("mysql");

class DAOReservations {
  pool;
  constructor(pool) {
    this.pool = pool;
  }

  getAllReservations(callback) {
    this.pool.query(
      "SELECT r.datecreation, r.dateini, r.dateend, u.name as userName, u.surname as userSurname, u.email as userEmail, i.name as installationName, i.id as installationId, f.name as facultyName, f.id as facultyId FROM ucm_aw_riu_res_reservations r JOIN ucm_aw_riu_ins_installations i ON r.instid = i.id JOIN ucm_aw_riu_usu_users u ON r.userid = u.id JOIN ucm_aw_riu_ins_faculties f ON i.facultyId = f.id ORDER BY datecreation ASC;",
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          callback(null, rows);
        }
      }
    );
  }
  

  createReservation(reservation, callback) {
    this.pool.query(
      "INSERT INTO ucm_aw_riu_res_reservations (dateini,dateend,datecreation,userid,instid) VALUES (?, ?, ?, ?, ?)",
      [
        reservation.dateini,
        reservation.dateend,
        reservation.datecreation,
        reservation.userid,
        reservation.instid,
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

  checkUserQueue(reservation, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_res_reservations WHERE userid = ? AND instid = ?",
      [reservation.userid, reservation.instid],
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

  getNextInQueue(instid, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_queue WHERE instid = ? ORDER BY datecreation ASC LIMIT 1",
      [instid],
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

  deleteFromQueue(id, callback) {
    this.pool.query(
      "DELETE FROM ucm_aw_riu_queue WHERE id = ?",
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

  searchReservations(query, startDate, endDate, callback) {
    this.pool.query(
      "SELECT r.datecreation, r.dateini, r.dateend, u.name as userName, u.surname as userSurname, u.email as userEmail, i.name as installationName, i.id as installationId, f.name as facultyName, f.id as facultyId FROM (ucm_aw_riu_res_reservations r JOIN ucm_aw_riu_ins_installations i ON r.instid = i.id JOIN ucm_aw_riu_usu_users u ON r.userid = u.id JOIN ucm_aw_riu_ins_faculties f ON i.facultyId = f.id) WHERE (u.name LIKE ? OR u.surname LIKE ? or u.email LIKE ?) AND (r.dateini >= ? AND r.dateend <= ?) ORDER BY datecreation ASC;",
      [`%${query}%`, `%${query}%`, `%${query}%`, startDate, endDate],
      (err, rows) => {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          callback(null, rows);
        }
      }
    );
  }

  checkUserReservation(reservation, callback) {
    this.pool.query(
      "SELECT * FROM ucm_aw_riu_res_reservations WHERE userid = ? AND instid = ? AND dateini = ? AND dateend = ?",
      [reservation.userid, reservation.instid, reservation.dateini, reservation.dateend],
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

  addToQueue(reservation, callback) {
    this.pool.query(
      "INSERT INTO ucm_aw_riu_queue (dateini,dateend,datecreation,userid,instid) VALUES (?, ?, ?, ?, ?)",
      [
        reservation.dateini,
        reservation.dateend,
        reservation.datecreation,
        reservation.userid,
        reservation.instid,
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
  checkUserTimeSlots(day, instid, userid, callback) {
    const query = `
      SELECT 
        timeSlots.timeSlot,
        IF(reservations.userid IS NULL, 0, 1) AS userR
      FROM (
        SELECT '9-10' AS timeSlot UNION ALL
        SELECT '10-11' AS timeSlot UNION ALL
        SELECT '11-12' AS timeSlot UNION ALL
        SELECT '12-13' AS timeSlot UNION ALL
        SELECT '13-14' AS timeSlot UNION ALL
        SELECT '14-15' AS timeSlot UNION ALL
        SELECT '15-16' AS timeSlot UNION ALL
        SELECT '16-17' AS timeSlot UNION ALL
        SELECT '17-18' AS timeSlot UNION ALL
        SELECT '18-19' AS timeSlot UNION ALL
        SELECT '19-20' AS timeSlot UNION ALL
        SELECT '20-21' AS timeSlot
      ) AS timeSlots
      LEFT JOIN (
        SELECT 
          CONCAT(HOUR(dateini), '-', HOUR(dateend)) AS timeSlot,
          userid
        FROM ucm_aw_riu_res_reservations
        WHERE DATE(dateini) LIKE ? AND instid = ?
      ) AS reservations ON timeSlots.timeSlot = reservations.timeSlot AND reservations.userid = ?
    `;
    
    this.pool.query(query, [day, instid, userid], (err, rows) => {
      if (err) {
        callback(err);
      } else {
        callback(null, rows);
      }
    });
  }

  checkReservation(day, instid, callback) {
    const query = `
      SELECT 
        timeSlots.timeSlot,
        IFNULL(reservations.numReservations, 0) AS numReservations
      FROM (
        SELECT '9-10' AS timeSlot UNION ALL
        SELECT '10-11' AS timeSlot UNION ALL
        SELECT '11-12' AS timeSlot UNION ALL
        SELECT '12-13' AS timeSlot UNION ALL
        SELECT '13-14' AS timeSlot UNION ALL
        SELECT '14-15' AS timeSlot UNION ALL
        SELECT '15-16' AS timeSlot UNION ALL
        SELECT '16-17' AS timeSlot UNION ALL
        SELECT '17-18' AS timeSlot UNION ALL
        SELECT '18-19' AS timeSlot UNION ALL
        SELECT '19-20' AS timeSlot UNION ALL
        SELECT '20-21' AS timeSlot
      ) AS timeSlots
      LEFT JOIN (
        SELECT 
          CONCAT(HOUR(dateini), '-', HOUR(dateini) + 1) AS timeSlot,
          COUNT(*) AS numReservations
        FROM ucm_aw_riu_res_reservations
        WHERE DATE(dateini) LIKE ? AND instid = ?
        GROUP BY HOUR(dateini)
        ORDER BY HOUR(dateini) ASC
      ) AS reservations ON timeSlots.timeSlot = reservations.timeSlot
      ORDER BY HOUR(timeSlots.timeSlot) ASC;
    `;

    this.pool.query(query, [day, instid], (err, rows) => {
      if (err) {
        callback(err);
      } else {
        callback(null, rows);
      }
    });
  }

  getNumReservasInDay(day, instid, callback) {
    this.pool.query(
      "SELECT COUNT(*) AS reservation_count FROM ucm_aw_riu_res_reservations WHERE DATE(dateini) = ? AND instid = ?;",
      [day, instid],
      (err, rows) => {
        if (err) {
          callback(err);
        } else {
          if (rows.length === 1) {
            callback(null, rows[0]);
          } else {
            //ha habido un error
            callback("error: numero incorrecto para query getNumReservasInDay");
          }
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
      "SELECT r.id, r.dateini, r.dateend, r.datecreation, r.userid, r.instid, i.name AS instname, i.facultyId, f.name AS facultyname FROM ucm_aw_riu_res_reservations r JOIN ucm_aw_riu_ins_installations i ON r.instid = i.id JOIN ucm_aw_riu_ins_faculties f ON i.facultyId = f.id WHERE r.userid = ? ORDER BY r.dateini DESC",
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
      "SELECT r.datecreation, r.dateend, r.dateini, u.name AS userName, u.surname AS userSurname, u.email as userEmail FROM ucm_aw_riu_res_reservations r JOIN ucm_aw_riu_usu_users u ON r.userid = u.id WHERE instid = ?",
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
