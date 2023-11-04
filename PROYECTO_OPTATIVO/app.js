const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const fs = require('fs');
const mime = require('mime');

const path = require('path');
const mysql = require('mysql');
const DAO = require('./db/DAO');

const pool = mysql.createPool({
    host: "localhost",
    user: "admin_aw",
    password: "",
    database: "viajes"
});

const app = express();
const Dao = new DAO(pool);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); // For handling JSON in request body
app.use(express.static(path.join(__dirname, 'public')));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Create auth session
app.use(
    session({
        secret: 'secret_key',
        resave: false,
        saveUninitialized: true,
    })
)

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
        const userId = req.session.user.id;
        const { destinoId, numPersonas, startDate, endDate } = req.body
        
        Dao.isDestinoAvailable({ destinoId, numPersonas, startDate, endDate }, function(err, isAvailable){
            if (err) {
                console.log(err);
                res.status(500).send('Server Error');
            } else {
                if(isAvailable){
                    Dao.createReserva({ destinoId, numPersonas, startDate, endDate,  userId}, function(err, reservaId){
                        if (err) {
                            console.log(err);
                            res.status(500).send('Server Error');
                        } else {
                            console.log(`Reserva con ID ${reservaId} creada`);
                            res.redirect('/userPage');
                        }
                    })
                }
                else{
                    res.status(500).send('Dates not available');
                }
            }
        })
    }
});

app.post('/cancelar', (req, res) => {
    if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        const userId = req.session.user.id;
        const { reservaId } = req.body
        
        Dao.getSingleReserva(userId, reservaId, function(err, reservaExists){
            if (err) {
                console.log(err);
                res.status(500).send('Server Error');
            } else {
                if(reservaExists){
                    Dao.borrarReserva(reservaId, function(err, affectedRows){
                        if (err || affectedRows > 1) {
                            console.log(err);
                            res.status(500).send('Server Error');
                        } else {
                            console.log(`Reserva con ID ${reservaId} eliminada`);
                            res.redirect('/userPage');
                        }
                    })
                }
                else{
                    res.status(500).send(`Reserva ${reservaId} does not exist for user ${userId}`);
                }
            }
        })
    }
});

app.get("/destination", (req, res) => {
    const destinationId = req.query.id;
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
                    Dao.getComments(destinationId, function(err, comments){
                        if(err){
                            console.log(err);
                            res.status(500).send('Server Error');
                        } else {
                            res.render("destination", { isAuthenticated: req.session.user !== undefined, source: `/destination?id=${destinationId}`, dest, image_ids, comments : comments });
                        }
                    });
                }
            });
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
// function imageToHex(imgName) {
//     const bitmap = fs.readFileSync(`./resources/${imgName}.jpg`);
//     const hexadecimalImage = bitmap.toString('hex');
//     fs.writeFileSync(`./hexes/${imgName}.txt`, hexadecimalImage);
// }
// function hexToImage(hexFileName, outputFileName) {
//     const hexData = fs.readFileSync(`./hexes/${hexFileName}.txt`, 'utf8');
//     const buffer = Buffer.from(hexData, 'hex');
//     fs.writeFileSync(`./testingPhotos/${outputFileName}.jpg`, buffer);
//   }
// for(let i = 1; i <= 90; i++){
//     const hexData = fs.readFileSync(`./hexes/${i}.txt`, 'utf8');
//     const buffer = Buffer.from(hexData, 'hex');
//     fs.writeFileSync(`./testingPhotos/${i}.jpg`, buffer);
// }

