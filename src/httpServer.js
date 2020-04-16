const http = require('http');

exports.start = (_port = 80) => {
    http.createServer(function (req, res) {
        setTimeout(() => {
            //res.statusCode = 500
            res.write(`Hello World`);
            res.end();
        }, 0)
    }).listen(_port);

    console.log(`lisining on port ${_port}`);
}

this.start();
