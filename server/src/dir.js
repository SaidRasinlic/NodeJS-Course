const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, 'files', 'new'))) {
    fs.mkdir(path.join(__dirname, 'files', 'new'), (err) => {
        if (err) throw err;

        console.log('Directory created.');
    });
}

if (fs.existsSync(path.join(__dirname, 'files', 'new'))) {
    fs.rmdir(path.join(__dirname, 'files', 'new'), (err) => {
        if (err) throw err;

        console.log('Directory deleted.');
    });
}

process.on('uncaughtException', err => {
    console.log(`There was an uncaught error: ${err}`);
    process.exit(1);
});