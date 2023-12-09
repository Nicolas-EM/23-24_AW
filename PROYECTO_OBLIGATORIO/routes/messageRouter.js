"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios

const messageController = require("../controllers/messageController");

let messageRouter = require('express').Router();
const messageCtrl = new messageController();

messageRouter.get('/', messageCtrl.getMessages);

messageRouter.post('/send', messageCtrl.sendMessage);

module.exports = messageRouter;