const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const mysql = require('mysql');
import * as DAO from './DAO.js';//pending (!)
const connection = mysql.createConnection({
    host:"localhost",  
    user:"admin_aw",  
    password:"",  
    database:"viajes" });
    
try {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }

        console.log('Connected to database with connection id ' + connection.threadId);
    });
} catch (e) {
    console.error('Error connecting to database: ' + e.message);
}
const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");//pending review!! (!)



// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    DAO.getAllCards((err, cards) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('index.ejs', { cards });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

//jpg to hex converter:
function imageToHex() {
    const bitmap = fs.readFileSync('./resources/vacation_1.jpg');
    const hexadecimalImage = bitmap.toString('hex');
    fs.writeFileSync('./image1.txt', hexadecimalImage);
}
