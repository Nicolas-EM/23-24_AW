const mysql = require("mysql");

class DAOInstallations {
    pool;
    constructor(pool) {
        this.pool = pool;
    }

    getInstallationById(id, callback) {
        this.pool.query(
            "SELECT * FROM ucm_aw_riu_ins_facilities WHERE id = ?",
            [id],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    if (rows.length === 0) {
                        callback(null, null); // No installation found with the given id
                    } else {
                        callback(null, rows[0]);
                    }
                }
            }
        );
    }
    getAllInstallations(callback) {
        this.pool.query("SELECT * FROM ucm_aw_riu_ins_facilities", (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    }

    deleteFacility(id, callback) {
        this.pool.query(
            "DELETE FROM ucm_aw_riu_ins_facilities WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    }

    createFacility(facility, callback) {
        this.pool.query(
            "INSERT INTO ucm_aw_riu_ins_facilities (name, availabity, type, capacity, ImageName, ImageType) VALUES (?, ?, ?, ?, ?, ?)",
            [
                facility.name,
                facility.availabity,
                facility.type,
                facility.capacity,
                facility.ImageName,
                facility.ImageType,
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
}
module.exports = DAOInstallations;