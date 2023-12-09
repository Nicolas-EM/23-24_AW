const mysql = require("mysql");

class DAOMessages {
    pool;
    constructor(pool) {
        this.pool = pool;
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

    createNewMessage(message, callback) {
        this.pool.query(
            "INSERT INTO ucm_aw_riu_messages (sender_id, receiver_id, message, timestamp) VALUES (?, ?, ?, ?)",
            [
                message.sender_id,
                message.receiver_id,
                message.message,
                message.timestamp,
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
