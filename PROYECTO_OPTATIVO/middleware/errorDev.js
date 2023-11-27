const devErrorHandler = (error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500).render("error", {error});
}

module.exports = devErrorHandler;