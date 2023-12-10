"use strict";

const { check } = require("express-validator"); //para validar los datos de los formularios

const messageController = require("../controllers/messageController");
const requireAdmin = require('../middleware/requireAdmin');

let messageRouter = require('express').Router();
const messageCtrl = new messageController();

messageRouter.get('/', messageCtrl.getMessages);

messageRouter.get('/chats', messageCtrl.getChatDetails);

messageRouter.get('/chats/:id', messageCtrl.getChat);

messageRouter.post('/send/user', messageCtrl.sendUserMessage);

messageRouter.post('/send/faculty', messageCtrl.sendFacultyMessage);

messageRouter.post('/send/', requireAdmin, messageCtrl.sendOrgMessage);

module.exports = messageRouter;