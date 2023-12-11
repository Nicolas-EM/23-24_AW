const mysql = require("mysql");

class DAOFaculties {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    createFaculty(name, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("INSERT INTO ucm_aw_riu_ins_faculties (name) VALUES (?);", [name], function (err, rows) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                    connection.release();
                });
            }
        });
    }
    getFacultyById(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT * FROM ucm_aw_riu_ins_faculties WHERE id = ?;", [id], function (err, rows) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, rows[0]);
                    }
                    connection.release();
                });
            }
        });
    }
    
    getFaculties(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            } else {
                connection.query("SELECT * FROM ucm_aw_riu_ins_faculties;", function (err, rows) {
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