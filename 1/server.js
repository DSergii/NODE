const {Server} = require('http');
const handler = require('handler');
const server = new Server();

server.on('request', handler)

server.listen(8000);