const LOG_TYPES = { STDOUT: 'stdout', FLUENTD: 'fluentd', LOGSTASH: 'logstash', ELASTICSEARCH: 'elasticsearch' }
const _SENDLOGSTO = process.env.SEND_LOGS_TO || LOG_TYPES.LOGSTASH;

exports.logReq = require(`./${_SENDLOGSTO}.js`).logReq;
