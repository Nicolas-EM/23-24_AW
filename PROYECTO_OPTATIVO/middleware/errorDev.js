const devErrorHandler = (error, req, res, next) => {
    res.status(error.status || 500).render("error", {error});
}

module.exports = devErrorHandler;