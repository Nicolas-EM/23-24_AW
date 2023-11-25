function requireLogin(request, response, next){
    if (request.session && request.session.userId) {
        // If authenticated, continue with the request
        return next();
    } else {
        response.redirect("/");
    }
}

module.exports = requireLogin;