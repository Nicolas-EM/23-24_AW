function prodErrorHandler(err, req, res, next) {
    res.setFlash(err.message);
    res.redirect(req.body.source);
}

module.exports = prodErrorHandler;