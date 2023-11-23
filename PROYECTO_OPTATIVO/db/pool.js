const mysql = require('mysql');

const pool = mysql.createPool({
  host: "localhost",
  user: "admin_aw",
  password: "",
  database: "viajes"
});

module.exports = pool;