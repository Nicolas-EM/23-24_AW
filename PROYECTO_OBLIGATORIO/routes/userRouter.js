"use strict";

const { check, validationResult } = require("express-validator"); //para validar los datos de los formularios
// middleware login
const requireAdmin = require('../middleware/requireAdmin');
const requireLogin = require('../middleware/requireLogin');

let userRouter = require('express').Router();

app.get('/', requireLogin, (req, res, next) => {
    res.status(200).render("user", { csrfToken: req.csrfToken() });
});

app.post('/create', (req, res, next) => {

});

app.post('/update', requireLogin, (req, res, next) => {
    
});

app.post('/login', (req, res, next) => {
    
});

app.post('/logout', requireLogin, (req, res, next) => {
    
});

app.post('/role', requireAdmin, (req, res, next) => {
    
});

app.post('/validate', requireAdmin, (req, res, next) => {
    
});

app.get('/byFaculty', requireAdmin, (req, res, next) => {
    
});

module.exports = userRouter;