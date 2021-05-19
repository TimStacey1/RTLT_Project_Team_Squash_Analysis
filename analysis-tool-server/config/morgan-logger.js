// Error logging and file transport
const logger = require('./winston-logger');
const morgan = require('morgan');
const json = require('morgan-json');
const format = json({
    method: ':method',
    url: ':url',
    status: ':status',
    responseTime: ':response-time'
})

const morganLogger = morgan(format, {
    stream: {
        write: (message) => {
            const {
                method,
                url,
                status,
                responseTime
            } = JSON.parse(message)

            logger.info('HTTP LOG', {
                timestamp: new Date().toString(),
                method,
                url,
                status: Number(status),
                responseTime: Number(responseTime)
            })
        }
    }
})

module.exports = morganLogger
