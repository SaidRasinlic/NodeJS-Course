const path = require('path');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3500;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
  // res.sendFile('views/index.html', { root: './' }); same as the upper one
});

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
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

app.get('/*', (req, res) => {
  res.status(404).sendFile('views/404.html', { root: './' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
