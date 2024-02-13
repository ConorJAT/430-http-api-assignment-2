const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    // application/x-www-form-urlencoded (key1=value1&key2=value2)
    const bodyString = Buffer.concat(body).toString();
    let bodyParams;

    if (request.headers['content-type'] === 'application/json') {
      bodyParams = JSON.parse(bodyString);
    } else {
      bodyParams = query.parse(bodyString);
    }

    handler(request, response, bodyParams);
  });
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    notReal: jsonHandler.notReal,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notReal: jsonHandler.notRealMeta,
  },
  POST: {
    '/addUsers': parseBody,
  },
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  const methodHandler = urlStruct[request.method];
  if (!methodHandler) {
    urlStruct.HEAD.notReal(request, response);
  }

  const handlerFunc = methodHandler[parsedURL.pathname];
  if (handlerFunc) {
    handlerFunc(request, response, jsonHandler.addUser);
  } else {
    urlStruct.GET.notReal(request, response);
  }
};

http.createServer(onRequest).listen(port, () => { console.log(`Listening on 127.0.0.1:${port}`); });
