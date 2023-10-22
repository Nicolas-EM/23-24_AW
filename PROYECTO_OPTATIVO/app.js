const express = require('express');
const session = require('express-session');
const fs = require('fs');
const mime = require('mime');

const path = require('path');
const mysql = require('mysql');
const DAO = require('./DAO');

const pool = mysql.createPool({
    host: "localhost",
    user: "admin_aw",
    password: "",
    database: "viajes"
});

const app = express();
const Dao = new DAO(pool);
app.set("view engine", "ejs");
app.use(express.json()); // For handling JSON in request body
app.set("views", path.join(__dirname, "views"));//pending review!! (!)
/////////////
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
/////////////

// Create auth session
app.use(
    session({
        secret: 'secret_key',
        resave: false,
        saveUninitialized: true,
    })
)

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "resources")));
app.use(express.static(path.join(__dirname, "js")));

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

app.get('/', function (req, res) {
    Dao.getDestinos(function (err, destinos) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
            res.render("index", { isAuthenticated: req.session.user !== undefined, source: "/", destinations: destinos });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password, source } = req.body
    console.log(email);
    console.log(password);

    // Validate username and password (e.g., against a database)
    // ...

    // If valid credentials, create a session
    req.session.user = { email }
    console.log(source);
    res.redirect(source);
})

app.get("/destination", (req, res) => {
    var destinationId = req.query.id;
    console.log("Received destinationId:", destinationId);
    // Find the destination object using id (for instance from a database)
    Dao.getDestinoById(destinationId, function (err, dest) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            res.render("destination", { isAuthenticated: req.session.user !== undefined, source: "/destination", dest: dest[0] }); //des[0] because it's an array
        }
    });
});

app.get("/userPage", (req, res) => {
    res.render("userPage", { isAuthenticated: req.session.user !== undefined });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})


//jpg to hex converter:
function imageToHex() {
    const bitmap = fs.readFileSync('./resources/vacation_1.jpg');
    const hexadecimalImage = bitmap.toString('hex');
    fs.writeFileSync('./image1.txt', hexadecimalImage);
}
