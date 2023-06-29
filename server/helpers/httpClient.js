// HTTP CLIENT
const axios = require("axios");
const http = require('http');
const https = require('https');

const HTTP_TIMEOUT = 10000;

const httpClient = axios.create({
    timeout: HTTP_TIMEOUT,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
});

module.exports = httpClient;