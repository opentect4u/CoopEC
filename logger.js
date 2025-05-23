// logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log' })
  ]
});

module.exports = logger;
