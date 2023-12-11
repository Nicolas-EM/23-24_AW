const mysql = require("mysql");

class DAOOrg {
    pool;
    constructor(pool) {
        this.pool = pool;
    }

    getOrg(callback) {
        this.pool.query(
            "SELECT * FROM ucm_aw_riu_org WHERE id = 1;",
            (err, row) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, row[0]);
                }
            }
        );
    }

    getPicture(callback) {
        this.pool.query(
            "SELECT foto FROM ucm_aw_riu_org WHERE id = 1;",
            (err, row) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, row[0].foto);
                }
            }
        );
    }

    setPicture(blob, callback) {
        this.pool.query(
            "UPDATE ucm_aw_riu_org SET foto = ? WHERE id = 1;", [blob],
            (err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    }

    updateOrg(name, dir, callback) {
        this.pool.query(
            "UPDATE ucm_aw_riu_org SET name = ?, dir = ? WHERE id = 1;", [name, dir],
            (err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    }
}

module.exports = DAOOrg;
