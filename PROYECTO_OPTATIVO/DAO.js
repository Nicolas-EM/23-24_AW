module.exports = {
    getDestinos,
    getDestinosById,
    createUser,
    createReserve
};
async function getDestinos(con) {
    try {
        con = await pool.getConnection();
        const rows = await con.query('SELECT * FROM destinos');
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (con) con.release();
    }
}

async function getDestinosById(id,con) {
    try {
        con = await pool.getConnection();
        const row = await con.query('SELECT * FROM destinos WHERE id = ?', [id]);
        return row;
    } catch (err) {
        throw err;
    } finally {
        if (con) con.release();
    }
}

async function createUser(user, con) {
    try {
        con = await pool.getConnection();
        const existingUser = await con.query('SELECT * FROM users WHERE correo = ?', [user.correo]);
        if (existingUser.length > 0) {
            throw new Error('El usuario ya existe!');
        }
        const result = await con.query('INSERT INTO users (nombre, correo, passwd) VALUES (?, ?, ?)', [user.nombre, user.correo, user.passd]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (con) con.release();
    }
}
async function createReserve(res, con) {
    try {
        con = await pool.getConnection();
        let existingReserve = await con.query('SELECT * FROM reservas WHERE destino_id = ? AND nombre_cliente = ? AND correo_cliente = ? AND fecha_reserva = ?', [res.destino_id, res.nombre_cliente, res.correo_cliente, res.fecha_reserva]);
        if (existingReserve.length > 0) {
            throw new Error('La reserva solicitada ya existe!');
        }
        const result = await con.query('INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?, ?, ?, ?)', [res.destino_id, res.nombre_cliente, res.correo_cliente, res.fecha_reserva]);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (con) con.release();
    }
}