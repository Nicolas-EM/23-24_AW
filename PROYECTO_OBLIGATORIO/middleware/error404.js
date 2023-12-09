function error404Handler(req, res, next){
    // res.setFlash("Error 404: Página no encontrada");
    res.redirect("/");
}

module.exports = error404Handler;