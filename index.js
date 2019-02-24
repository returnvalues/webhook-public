const http    = require('http');
const spawn   = require('child_process').spawn;
const crypto  = require('crypto');
const url     = require('url');

const secret  = '<YOUR-SECRET>';
const port    = <YOUR-PORT>;

http.createServer((req, res) => {
    const { headers, method, url: reqUrl } = req;
    console.log("request received");
    res.writeHead(400, {"Content-Type": "application/json"});
    const ip = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;

    const path = url.parse(reqUrl).pathname;
    if(process.env.NODE_ENV !== 'development') {
        if(path !== '/push' || req.method !== 'POST'){
            const data = JSON.stringify({"error": "invalid request"});
            return res.end(data);
        }
    }

    let payloadString = '';
    req.on('data', (data) => {
        payloadString += data;
    });

    req.on('end', () => {
        const hash = "sha1=" + crypto.createHmac('sha1', secret).update(payloadString).digest('hex');
        if(process.env.NODE_ENV !== 'development') {
            if(hash != req.headers['x-hub-signature']){
                const data = JSON.stringify({"error": "invalid key", key: hash});
                return res.end(data);
            }
        }

        payloadString = decodeURIComponent(payloadString).substring(8);

        const payload = JSON.parse(payloadString);
        const { ref, ref_type } = payload;
        const { name: repoName } = payload.repository;
        const shellFile = `${repoName}.sh`;

        if (ref_type === 'tag') {
            console.log(`Execute Shell Script: sh ${shellFile} ${ref}`);
            const runSh = spawn('sh', [shellFile, ref]);
            runSh.stdout.on('data', (data) => {
                const buff = new Buffer(data);
                console.log('stdout::', buff.toString('utf-8'));
            });
        }

        const responseBody = { headers, method, reqUrl, payload };

        res.writeHead(200, {"Content-Type": "application/json"});
        return res.end(JSON.stringify(responseBody))
    });
}).listen(port);

console.log("Server listening at " + port);
