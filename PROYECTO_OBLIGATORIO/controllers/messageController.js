"use strict";
const pool = require("../db/pool");
const DAOMessages = require('../db/DAOMessages');
const DAOUsers = require('../db/DAOUsers');
const { validationResult } = require("express-validator");

const daoMessages = new DAOMessages(pool);
const daoUsers = new DAOUsers(pool);

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

    sendUserMessage(req, res, next) {
        const senderId = req.session.userId;
        const { recipientId, message } = req.body;

        daoMessages.createNewMessage(senderId, recipientId, message, (err, msgId) => {
            if(err)
                next(err)
            else
                res.send("OK");
        });
    }

    sendFacultyMessage(req, res, next) {
        const senderId = req.session.userId;
        const { recipientId, message } = req.body;

        daoUsers.getUserByFaculty(recipientId, (err, users) => {
            if(err)
                next(err);
            else{
                for(let x in users){
                    const user = users[x];
                    daoMessages.createNewMessage(senderId, user.id, message, (err, msgId) => {
                        if(err)
                            next(err)
                    });
                    const createMessagePromises = users.map(user => {
                        return new Promise((resolve, reject) => {
                            daoMessages.createNewMessage(senderId, user.id, message, (err, msgId) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(msgId);
                                }
                            });
                        });
                    });
        
                    Promise.all(createMessagePromises).then(() => {
                        res.send("OK");
                    }).catch(err => {
                        next(err);
                    });
                }
            }
        })
    }

    sendOrgMessage(req, res, next) {
        const senderId = req.session.userId;
        const {  message } = req.body;

        daoUsers.getAllUsers((err, users) => {
            if(err)
                next(err);
            else{
                const createMessagePromises = users.map(user => {
                    return new Promise((resolve, reject) => {
                        daoMessages.createNewMessage(senderId, user.id, message, (err, msgId) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(msgId);
                            }
                        });
                    });
                });
    
                Promise.all(createMessagePromises).then(() => {
                    res.send("OK");
                }).catch(err => {
                    next(err);
                });
            }
        })
    }

    getChatDetails(req, res, next) {
        const userId = req.session.userId;

        daoMessages.getChatDetails(userId, (err, chats) => {
            if(err)
                next(err);
            else
                res.json(chats);
        })
    }

    getChat(req, res, next) {
        const userId = req.session.userId;
        const chatUserId = req.params.id;

        daoMessages.getChatMessages(userId, chatUserId, (err, messages) => {
            if(err)
                next(err);
            else
                res.json({sessionId: userId, messages});
        })
    }
}

module.exports = messagesController;