const logger = require('fluent-logger');

const _LOGGER_HOST = process.env.FLUENTD_HOST || 'localhost';
const _LOGGER_PORT = process.env.FLUENTD_PORT || 2123;
const _LOGGER_TAG = process.env.FLUENTD_TAG || 'k8s-pod2pod-log';
const loggerPort = _LOGGER_PORT ? Number(_LOGGER_PORT) : undefined;

logger.configure(_LOGGER_TAG, {
    host: _LOGGER_HOST,
    port: loggerPort,
    timeout: 3.0,
    reconnectInterval: 30000 // 10 minutes
});

console.log('log to fluentd: ' + _LOGGER_HOST, loggerPort)

exports.logReq = (logObj) => {
    logger.emit('follow', logObj);
    //console.log(logObj)
}