const { validationResult } = require("express-validator"); //para validar los datos de los formularios

function validator(req, res, next){
    // si encuentra error, devuelve 400:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
}

module.exports = validator;