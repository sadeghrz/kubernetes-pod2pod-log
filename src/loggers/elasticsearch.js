const logger = require('elasticsearch');

const _LOGGER_HOST = process.env.ELASTICSEARCH_HOST || 'localhost';
const _LOGGER_PORT = process.env.ELASTICSEARCH_PORT || 9200;
const _LOGGER_LOG = process.env.ELASTICSEARCH_LOG || 'trace';
const _LOGGER_API_VERSION = process.env.ELASTICSEARCH_API_VERSION || '7.2';
const _LOGGER_INDEX = process.env.ELASTICSEARCH_INDEX || 'k8s-internal-networking';
const _LOGGER_TYPE = process.env.ELASTICSEARCH_TYPE;
const loggerPort = _LOGGER_PORT ? Number(_LOGGER_PORT) : undefined;

var client = new logger.Client({
    host: `${_LOGGER_HOST}:${_LOGGER_PORT}`,
    log: _LOGGER_LOG,
    apiVersion: _LOGGER_API_VERSION
});

console.log('log to elasticsearch: ' + _LOGGER_HOST, loggerPort, _LOGGER_INDEX)

exports.logReq = (logObj) => {
    const body = { body: logObj, index: _LOGGER_INDEX, type: _LOGGER_TYPE };
    client.index(body);
    //console.log(body);
}
