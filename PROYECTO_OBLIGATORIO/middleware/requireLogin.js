function requireLogin(req, res, next) {
    if (req.session && req.session.userId) {
        // If authenticated, continue with the request
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = requireLogin;