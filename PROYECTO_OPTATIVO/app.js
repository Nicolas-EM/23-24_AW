const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

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

app.post('/search', (req, res) => {
    const { query, maxPrice } = req.body;

    Dao.getSearch(query, maxPrice, function (err, destinos) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
            console.log(destinos);
            res.render('index', { isAuthenticated: req.session.user !== undefined, source: "/", destinations: destinos });
        }
    });

});

app.post('/login', (req, res) => {
    const { email, password, source } = req.body
    console.log(`Login from ${source}`);

    Dao.getSingleUser(email, function (err, userData) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
            if (bcrypt.compare(password, userData.password)) {
                console.log("Authenticated");
                // If valid credentials, create a session
                req.session.user = { email, id: userData.id };
                res.redirect(source);
            }
            else {
                console.log("Denied");
                res.status(401);
                res.redirect(source);
            }
        }
    });
})

app.post('/register', (req, res) => {
    const { nombre, email, password, source } = req.body;
    console.log(`Register from ${source}`);
    // Create hasher
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    Dao.createUser({ nombre, email, hashedPassword }, function (err, userId) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
            if (userId !== undefined) {
                console.log("Registered");
                // If valid credentials, create a session
                req.session.user = { email, id: userId };
                res.status(200).redirect(source);
            }
            else {
                console.log("Registration failed");
                res.status(401).redirect(source);
            }
        }
    });
})
//pending //TODO!!c
app.post('/reservar', (req, res) => {
    if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        let fecha = req.body.fecha;
        let personas = req.body.personas;
        // Process reservation request
        // activar toast del ejs : (no con esto) res.send('Reservation received!');
        res.render("index", { isAuthenticated: true, source: "/", success: "Reservation received!" });
    }
});
        let email = req.session.user.email;
        Dao.getSingleUser(email, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).send('Server Error');
            }
            else {
                Dao.getReservas(req.session.user.id, function (err, reservas){
                    if (err) {
                        console.log(err);
                        res.status(500).send('Server Error');
                    } else {
                        res.render("userPage", { isAuthenticated: true, user, reservas})
                    }
                });
            }
        });

app.get("/destination", (req, res) => {
    var destinationId = req.query.id;
    console.log("Received destinationId:", destinationId);
    // Find the destination object using id (for instance from a database)
    Dao.getDestinoById(destinationId, function (err, dest) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            Dao.getDestinoImages(destinationId, function(err, image_ids){
                if(err){
                    console.log(err);
                    res.status(500).send('Server Error');
                } else {
                    res.render("destination", { isAuthenticated: req.session.user !== undefined, source: `/destination?id=${destinationId}`, dest, image_ids });
                }
            })
        }
    });
});

app.get("/userPage", (req, res) => {
    if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        const email = req.session.user.email;
        Dao.getSingleUser(email, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).send('Server Error');
            }
            else {
                Dao.getReservas(req.session.user.id, function (err, reservas){
                    if (err) {
                        console.log(err);
                        res.status(500).send('Server Error');
                    } else {
                        res.render("userPage", { isAuthenticated: true, user, reservas})
                    }
                });
            }
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
});


//jpg to hex converter:
function imageToHex() {
    const bitmap = fs.readFileSync('./resources/vacation_1.jpg');
    const hexadecimalImage = bitmap.toString('hex');
    fs.writeFileSync('./image1.txt', hexadecimalImage);
}
