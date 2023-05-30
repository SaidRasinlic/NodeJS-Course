const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { logger } = require('../middleware/logEvents');
const credentials = require('../middleware/credentials');
const errorHandler = require('../middleware/errorHandler');
const verifyJWT = require('../middleware/verifyJWT');
const corsOptions = require('../config/corsOptions');

const app = express();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// built-in middleware for cookies
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '..', '/public')));
app.use('/subdir', express.static(path.join(__dirname, '..', '/public')));

const PORT = process.env.PORT || 3500;

app.use('/', require('../routes/root'));
app.use('/register', require('../routes/register'));
app.use('/auth', require('../routes/auth'));
app.use('/refresh', require('../routes/refresh'));
app.use('/logout', require('../routes/logout'));

app.use(verifyJWT);
app.use('/players', require('../routes/api/players'));

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
