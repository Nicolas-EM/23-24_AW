function requireLogin(request, response, next){
    if (request.session.user === undefined){
        res.redirect("/");
    } else {
        next();
    }
}

module.exports = requireLogin;