const mysql = require("mysql");

class DAOFaculties {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    getFaculties(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT DISTINCT faculty FROM ucm_aw_riu_usu_users;", function (err, rows) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                    connection.release();
                });
            }
        });
    }
    getGroups(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT DISTINCT ugroup FROM ucm_aw_riu_usu_users;", function (err, rows) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                    connection.release();
                });
            }
        });
    }
    getGrades(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT DISTINCT grade FROM ucm_aw_riu_usu_users;", function (err, rows) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows);
                    }
                    connection.release();
                });
            }
        });
    }
}
module.exports = DAOFaculties;