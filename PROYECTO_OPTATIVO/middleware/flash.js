function flashMiddleware (request, response, next) {
    response.setFlash = function(msg) {
        request.session.flashMsg = msg;
    };

    response.locals.getAndClearFlash = function() {
        let msg = request.session.flashMsg;
        delete request.session.flashMsg;
        return msg;
    };

    next();
}

module.exports = flashMiddleware;