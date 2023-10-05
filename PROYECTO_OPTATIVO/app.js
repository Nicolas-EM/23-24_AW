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
function loadHtmlFile(filePath) {
    // Read the HTML file into a buffer
    const htmlBuffer = fs.readFileSync(filePath);

    // Convert the buffer to a string
    let htmlString = htmlBuffer.toString();

    // Find all the resource URLs in the HTML file
    const resourceRegex = /(?:src|href)="([^"]+)"/g;
    let match;
    while ((match = resourceRegex.exec(htmlString)) !== null) {
        const resourceUrl = match[1];
        const resourcePath = path.join(path.dirname(filePath), resourceUrl);
        try {
            const resourceBuffer = fs.readFileSync(resourcePath);
            const resourceBase64 = resourceBuffer.toString('base64');
            const resourceMimeType = mime.getType(resourcePath);
            const dataUri = `data:${resourceMimeType};base64,${resourceBase64}`;
            htmlString = htmlString.replace(resourceUrl, dataUri);
        } catch (err) {
            console.error(`Error loading resource ${resourceUrl}: ${err.message}`);
        }
    }

    return htmlString;
}

function loadHtmlDirectory(directoryPath) {
    let htmlMap = new Map();

    function loadHtmlFiles(directoryPath) {
        let files = fs.readdirSync(directoryPath);

        for (const file of files) {
            let filePath = path.join(directoryPath, file);
            let stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                loadHtmlFiles(filePath);
            } else if (path.extname(file) === '.html') {
                let htmlString = loadHtmlFile(filePath);
                htmlMap.set(file, htmlString);
            }
        }
    }

    loadHtmlFiles(directoryPath);

    return htmlMap;
}
//get all pages inside public folder in one function which can be escalable
let htmlMap = loadHtmlDirectory('./public');
for (const [htmlFile, htmlString] of htmlMap) {
    app.get(`/${htmlFile}`, (req, res) => {
        res.send(htmlString);
    });
}
app.get('/index.html', (req, res) => {

    let destinos = DAO.getDestinos(connection);

    res.render('index.ejs', { destinos: destinos });


});
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
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
