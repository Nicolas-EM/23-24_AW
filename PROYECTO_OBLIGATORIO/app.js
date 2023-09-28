//create express server
const express = require('express');
const app = express();
const port = 3000;

//connect to mariaDB through xampp apache 3306 port

//create mysql connection

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "", 
    database: "UCM_RIU", 
    port: 3306 
})

//connect to database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});
//create request to load login.html with all its properties, as well as scripts and css sheets:

app.use(express.static(__dirname + '/'));

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
//initiate server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});




