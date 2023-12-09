"use strict";
const pool = require("../db/pool");
const DAOMessages = require('../db/DAOMessages');
const { validationResult } = require("express-validator");

const daoMessages = new DAOMessages(pool);

class messagesController {
    getMessages(req, res, next) {
        const userId = req.session.userId;

        daoMessages.getMessagesByReceiver(userId, (err, messages) => {
            if(err)
                next(err);
            else
                res.json(messages);
        })
    }

    sendMessage(req, res, next) {

    }
}

module.exports = messagesController;