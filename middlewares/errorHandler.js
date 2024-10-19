// middlewares/errorHandler.js
const logger = require('../src/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
