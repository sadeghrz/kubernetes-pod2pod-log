const http = require('http');

exports.start = (_port = 80) => {
    http.createServer(function (req, res) {
    //     setTimeout(() => {
    //         //res.statusCode = 500
    //         res.write(`Hello WorldsssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsss
    // ssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWor
    // ldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssW
    // orldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssssssssssssss
    // sWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssssssssssss
    // sssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssssssssss
    // sssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssssssss
    // sssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssssss
    // sssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssss
    // ssssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsss
    // ssssssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorlds
    // ssssssssssssssWorldsssssssssssssssWorldssssssssssssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssss
    // ssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssssss
    // sssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssss
    // sssssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldss
    // sssssssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorld
    // sssssssssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWor
    // ldsssssssssssssssWorldsssssssssssssssWorldssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssW
    // orldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssss
    // ssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldssssssssss
    // sssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssss
    // ssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssssssssWorldsssssssssss
    // ssssWorldsssssssssssssss!s`);
    //         res.end();
    //     }, 0)
    }).listen(_port);

    console.log(`lisining on port ${_port}`);
}

this.start();
