const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack); // Log the error stack for debugging

    // Handle specific error types or custom errors
    if (err.name === 'UnauthorizedError') {
        return res.status(401).render('404', { message: 'Unauthorized Access' });
    }

    // Default error response for production
    if (process.env.NODE_ENV === 'production') {
        return res.status(500).render('404', { message: 'Something went wrong!' });
    } else {
        // Detailed error response for development
        return res.status(500).render('404', { message: err.message, error: err });
    }
};

module.exports = errorHandler;


