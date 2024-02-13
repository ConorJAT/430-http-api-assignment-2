const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

urlStruct = {
    'GET': {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/getUsers': jsonHandler.getUsers,
        notReal: jsonHandler.notReal
    },
    'HEAD': {
        '/getUsers': jsonHandler.getUsersMeta,
        notReal: jsonHandler.notRealMeta
    },
    'POST': {
        '/addUsers': jsonHandler.addUser
    }
}

const onRequest = (request, response) => {

};

http.createServer(onRequest).listen(port, () => { console.log(`Listening on 127.0.0.1:${port}`); });