/*****  just for test ******/
// let incCounter = 0;
// let outCounter = 0;

const os = require("os");
const Cap = require('cap').Cap;
const decoders = require('cap').decoders;
const loggers = require('./loggers')

/** Consts */
const MODES = { DEBUG: 'debug', PROD: 'prod', DEVELOPMENT: 'development' }

/** Environments variables */
const _IFACE = process.env.IFACE;
const _IGNOREURLS = process.env.IGNORE_URLS;
const _CAPFILTER = process.env.CAP_FILTER || `tcp and dst port 80 or src port 80`; // `tcp` for all packets
const _TIMEOUTINTERVALCHECK = process.env.TIMEOUT_INTERVAL_CHECK || 2000; // every 3 minutes (180000) ms
const _TIMEOUTAFTERMS = process.env.TIMEOUT_AFTER_MS || 10000; // 105000 ms = 105 sec
const _MODE = process.env.MODE || MODES.PROD; // DEBUG, PROD, DEVELOPMENT

/** Variables preparation */
const cap = new Cap();
const bufSize = 10 * 1024 * 1024;
const buffer = Buffer.alloc(65535);
const incReqData = {}
const outReqData = {}

const IFACEOBJ = _IFACE ? Cap.deviceList().filter((i) => i.name === _IFACE)[0] : Cap.deviceList()[0];
let IFACENAME = IFACEOBJ.name;
let IFACEADDR = IFACEOBJ.addresses[0].addr;
if (_MODE === MODES.DEVELOPMENT) {
    IFACENAME = 'lo';
    //setInterval(() => console.log(incCounter, outCounter), 3000)
    // setInterval(() => {
    //     console.log(`inc size: ${Object.keys(incReqData).length}`)
    //     console.log(`out size: ${Object.keys(outReqData).length}`)
    // }, 10000)
    require('./httpServer');
}

const HOSTNAME = os.hostname();
const ignoreUrls = _IGNOREURLS ? _IGNOREURLS.split(',') : ['/info', '/health'];

/** Configs */
const linkType = cap.open(IFACENAME, _CAPFILTER, bufSize, buffer);
cap.setMinBytes && cap.setMinBytes(0);

/** setup Interval for timeouted requests */
setInterval(checkTimeoutedRequests(outReqData), _TIMEOUTINTERVALCHECK)
setInterval(checkTimeoutedRequests(incReqData), _TIMEOUTINTERVALCHECK)

/** Log some infortmation */
console.log(`start capture http traffic on iface: ${IFACENAME} with serverAddr: ${IFACEADDR}`)
console.log(`check timeouted requests every ${_TIMEOUTINTERVALCHECK}ms. timeout request after ${_TIMEOUTAFTERMS}ms`)

/** Functions */
function checkTimeoutedRequests(ReqData) {
    return () => {
        const now = new Date().getTime()
        Object.keys(ReqData).forEach(reqKey => {
            const req = ReqData[reqKey]
            const reqTime = req.resTime;

            /** if it have no response */
            if (reqTime > 10000) {
                const resTime = (now - reqTime);
                /** if timeout reached */
                if (resTime >= _TIMEOUTAFTERMS) {
                    req["resTime"] = resTime / 1000
                    req["resCode"] = 408
                    loggers.logReq({ ...req, HOSTNAME });
                    delete ReqData[reqKey];
                }
            }
        });
    }
}

function getReqData(headers, type) {
    const headerObj = {};
    headers.map((h) => {
        const hs = h.split(" ");
        headerObj[hs[0].toLowerCase()] = hs[1];
    })
    const urlHeader = headers[0].split(" ");
    const url = urlHeader[1];
    if (ignoreUrls.indexOf(url) > -1) return
    const host = headerObj["host:"];
    const method = urlHeader[0]

    return { host, url, method, type }
}

function getResData(headers, req, time) {
    req["resTime"] = (time - req["resTime"]) / 1000
    req["resCode"] = headers[0].split(" ")[1]
    loggers.logReq({ ...req, HOSTNAME });
}

/** On packet receive event */
cap.on('packet', function (nbytes) {
    /** skip Arp packets with nbytes > 100 */
    if (linkType === 'ETHERNET' && nbytes > 100) {

        /** get src, dst and payload */
        let ret = decoders.Ethernet(buffer);
        ret = decoders.IPV4(buffer, ret.offset);
        const srcIP = ret.info.srcaddr;
        const dstIP = ret.info.dstaddr;
        ret = decoders.TCP(buffer, ret.offset);

        /** check protocol */
        const payload = buffer.slice(ret.offset, nbytes).toString("utf8");
        if (payload.indexOf('HTTP/') < 0) return

        /** check protocol */
        const srcPort = ret.info.srcport;
        const dstPort = ret.info.dstport;
        const src = `${srcIP}:${srcPort}`;
        const dst = `${dstIP}:${dstPort}`;
        const time = new Date().getTime()
        const headers = payload.split('\r\n\r\n')[0].split('\r\n')

        /** it's incoming traffic */
        //if (dst === `${IFACEADDR}:80`) { // just for test
        if (dstIP === IFACEADDR) {
            const req = outReqData[src];
            /** it's a response */
            if (req) {
                getResData(headers, req, time)
                delete outReqData[src]
                //outCounter++
                return;
            }

            /** it's a request */
            if (headers[0].indexOf('HTTP/1.1') === 0) {
                /** it's untracked response :( */
                return
            }
            const reqData = getReqData(headers, 'income');
            reqData ? incReqData[src] = { resTime: time, ...reqData } : null

        } else { /** t's outgoing traffic */
            const req = incReqData[dst];
            if (req) { /** it's a response */
                getResData(headers, req, time)
                delete incReqData[dst]
                //incCounter++
                return;
            }

            /** it's a request */
            if (headers[0].indexOf('HTTP/1.1') === 0) {
                /** it's untracked response :( */
                return
            }
            const reqData = getReqData(headers, 'outgo');
            reqData ? outReqData[dst] = { resTime: time, ...reqData } : null
        }
    }
});

/******** other commands  *********/
// let datalen = ret.info.totallen - ret.hdrlen;
// datalen -= ret.hdrlen;
//console.log(buffer.toString('binary', ret.offset, ret.offset + datalen));