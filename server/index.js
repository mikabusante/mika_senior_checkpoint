/* DO NOT EDIT */

const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const PORT = 1337;
server.listen(PORT, () => console.log('listening on port', PORT));
