
export function checkUserExists(emailInput) {
    var sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [emailInput], function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}
//now create the registerUser function registerUser(nameInput,emailInput,pwdInput); with the database

export function registerUser(nameInput, emailInput, pwdInput) {
    var sql = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
    connection.query(sql, [nameInput, emailInput, pwdInput], function (err, result) {
        if (err) throw err;
        console.log("Usuario registrado con exito");
    });
}


