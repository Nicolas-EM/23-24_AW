const mysql = require("mysql");

class DAOFaculties {
    pool;
    constructor(pool) {
        this.pool = pool;
    }

    //no tenemos tabla facultades... como solucionamos esto? una tabla 
    //de datos (facultades, grupos, etc??)


}
module.exports = DAOFaculties;