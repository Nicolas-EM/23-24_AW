const mysql = require("mysql");

class DAOMessages {
    pool;
    constructor(pool) {
        this.pool = pool;
    }

    getChatDetails(userId, callback) {
        this.pool.query(
            "SELECT DISTINCT u.id AS sender_id, u.name AS sender_name, u.surname AS sender_surname, u.email AS sender_email FROM ucm_aw_riu_usu_users u JOIN ucm_aw_riu_messages m ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id WHEN m.receiver_id = ? THEN m.sender_id END WHERE ? IN (m.sender_id, m.receiver_id);",
            [userId, userId, userId],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }

    getChatMessages(userId, chatId, callback) {
        this.pool.query(
            "SELECT m.*, u.name AS sender_name, u.surname AS sender_surname, u.email AS sender_email FROM ucm_aw_riu_messages m JOIN ucm_aw_riu_usu_users u ON m.sender_id = u.id WHERE (m.receiver_id = ? AND m.sender_id = ?) OR (m.receiver_id = ? AND m.sender_id = ?) ORDER BY m.timestamp ASC;",
            [userId, chatId, chatId, userId],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }

    //los mensajes donde el usuario es el destinatario y no el emisor
    getMessagesByReceiver(userId, callback) {
        this.pool.query(
            "SELECT m.*, u.name AS sender_name, u.surname AS sender_surname, u.email AS sender_email FROM ucm_aw_riu_messages m JOIN ucm_aw_riu_usu_users u ON m.sender_id = u.id WHERE m.receiver_id = ? ORDER BY m.timestamp ASC;",
            [userId],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }

    //los mensajes donde el usuario es el emisor y no el destinatario
    getMessagesBySender(userId, callback) {
        this.pool.query(
            "SELECT * FROM ucm_aw_riu_messages WHERE sender_id = ?",
            [userId],
            (err, rows) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, rows);
                }
            }
        );
    }

    createNewMessage(senderId, recipientId, message, callback) {
        this.pool.query(
            "INSERT INTO ucm_aw_riu_messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, ?)",
            [
                senderId,
                recipientId,
                message,
                new Date().toISOString().slice(0, 19).replace('T', ' '),
            ],
            (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result.insertId);
                }
            }
        );
    }

    deleteMessage(id, callback) {
        this.pool.query(
            "DELETE FROM ucm_aw_riu_messages WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        );
    }
}
module.exports = DAOMessages;
