const logger = require('logstash-client');

const _LOGGER_HOST = process.env.LOGSTASH_HOST || 'localhost';
const _LOGGER_PORT = process.env.LOGSTASH_PORT || 2123;
const _LOGGER_TYPE = process.env.LOGSTASH_TYPE || 'udp';
const loggerPort = _LOGGER_PORT ? Number(_LOGGER_PORT) : undefined;

var logstash = new logger({
    type: _LOGGER_TYPE,
    host: _LOGGER_HOST,
    port: loggerPort
});

console.log('log to logstash: ' + _LOGGER_HOST, loggerPort, _LOGGER_TYPE)

exports.logReq = (logObj) => {
    logstash.send(JSON.stringify(logObj));
    //console.log(logObj)
}