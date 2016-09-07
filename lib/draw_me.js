const winston = require('winston');

const config = {
    database  : require('../config/config.json'),
    webserver : require('../config/webserver.json'),
}

if (config.webserver.loggerFile) {
    winston.add(winston.transports.File, { filename: config.webserver.loggerFile });
}

module.exports = {
    config : config,
    models : require('../models'),
    //utils  : utils,
    logger : winston
};
