function requireAdmin(request, response, next){
    if (request.session && request.session.userId && request.session.role === "admin") {
        // If authenticated, continue with the request
        next();
    } else {
        // If not authenticated as an admin, handle the error
        const error = new Error("Unauthorized: Admin access required");
        error.status = 401; // Set the HTTP status code for unauthorized access
        next(error);
    }
}

module.exports = requireAdmin;