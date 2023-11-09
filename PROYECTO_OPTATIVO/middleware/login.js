function requireLogin(request, response, next){
    if (request.session.user === undefined){
        response.redirect("/");
    } else {
        next();
    }
}

module.exports = requireLogin;