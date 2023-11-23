function prodErrorHandler(err, req, res, next) {
    // res.setFlash(err.message);
    res.redirect("/");
}

module.exports = prodErrorHandler;