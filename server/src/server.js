const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const events = require('events');
const logEvents = require('./logEvents');

const eventEmitter = new events.EventEmitter();

eventEmitter.on('log', (message, logName) => logEvents(message, logName));

// setTimeout(() => {
//   eventEmitter.emit('log', 'Log event emitted!');
// }, 2000);

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf8' : '',
    );
    const data = contentType === 'application/json'
      ? JSON.parse(rawData) : rawData;

    response.writeHead(
      filePath.includes('404.html') ? 404 : 200,
      { 'Content-Type': contentType },
    );
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data,
    );
  } catch (err) {
    response.statusCode = 500;
    response.end();
    eventEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt');
    console.error(err);
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  eventEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
  }

  let filePath;

  if (contentType === 'text/html' && req.url === '/') {
    filePath = path.join(__dirname, '..', 'views', 'index.html');
  } else if (contentType === 'text/html' && req.url.slice(-1) === '/') {
    filePath = path.join(__dirname, '..', 'views', req.url, 'index.html');
  } else if (contentType === 'text/html') {
    filePath = path.join(__dirname, '..', 'views', req.url);
  } else {
    filePath = path.join(__dirname, '..', req.url);
  }

  // Makes .html extension not required in the browser
  if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { Location: '/new-page.html' });
        res.end();
        break;
      case 'www.page.html':
        res.writeHead(301, { Location: '/' });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, '..', 'views', '404.html'), 'text/html', res);
    }
  }
});

/* const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  if (req.url === '/' || req.url === '/index.html') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    path = path.join(__dirname, '..', 'views', 'index.html');
    fs.readFile(path, 'utf8', (err, data) => {
      res.end(data);
    });
  }
}); */

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
