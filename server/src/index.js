const path = require('path');
const express = require('express');
const cors = require('cors');
const { logger } = require('../middleware/logEvents');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// Custom middleware logger

app.use(logger);

const whitelist = ['http://localhost:3000', 'https://www.google.com'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) { // origin is undefined a.k.a localhost
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '/public')));

const PORT = process.env.PORT || 3500;

app.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
  // res.sendFile('views/index.html', { root: './' }); same as the upper one
});

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page'); // 302 by default (temp removed site)
});

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
  console.log('Attemted to load hello.html');
  next();
}, (req, res) => {
  res.send('Hello World!');
});

// Chaining route handlers

const one = (req, res, next) => {
  console.log('One');
  next();
};

const two = (req, res, next) => {
  console.log('Two');
  next();
};

const three = (req, res) => {
  console.log('Three');
  res.send('Chaining finished.');
};

app.get('/chain(.html)?', [one, two, three]);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile('views/404.html', { root: './' });
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
