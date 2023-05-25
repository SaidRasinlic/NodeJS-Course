const express = require('express');
const path = require('path');

const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
  // res.sendFile('views/index.html', { root: './' }); same as the upper one
});

router.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page'); // 302 by default (temp removed site)
});

module.exports = router;
