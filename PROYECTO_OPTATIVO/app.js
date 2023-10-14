const express = require('express');
const fs = require('fs');
const mime = require('mime');

const path = require('path');
const mysql = require('mysql');
const DAO = require('./DAO');
const pool = mysql.createPool({
    host:"localhost",  
    user:"admin_aw",  
    password:"",  
    database:"viajes" });
    

const app = express();
const Dao = new DAO(pool);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));//pending review!! (!)
/////////////

 /////////////


// Serve static files from the public directory
app.use(express.static(path.join(__dirname,"css")));
app.use(express.static(path.join(__dirname,"resources")));
// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
console.log("pre get");
app.get('/',function(req, res) {
    Dao.getDestinos(function(err, destinos){
        if(err){
            console.log(err);
        }
        else{
            console.log(destinos);
            res.render("index", {destinations: destinos});
        }
    });
 });
//jpg to hex converter:
function imageToHex() {
    const bitmap = fs.readFileSync('./resources/vacation_1.jpg');
    const hexadecimalImage = bitmap.toString('hex');
    fs.writeFileSync('./image1.txt', hexadecimalImage);
}
