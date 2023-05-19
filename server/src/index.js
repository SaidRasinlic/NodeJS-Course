const path = require('path');
const fsPromises = require('fs').promises;

const fsOps = async () => {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');
    console.log(data);
    await fsPromises.writeFile(path.join(__dirname, 'files', 'starter.txt'), '- FS Promises rocks!');
    await fsPromises.appendFile(path.join(__dirname, 'files', 'starter.txt'), '\n- fsProm append mode.');
    await fsPromises.rename(path.join(__dirname, 'files', 'starter.txt'), path.join(__dirname, 'files', 'fsPromises.txt'));
    const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'fsPromises.txt'), 'utf8');
    console.log(newData);
    await fsPromises.unlink(path.join(__dirname, 'files', 'fsPromises.txt'));
  } catch (err) {
    console.error(err);
  }
};

fsOps();

// fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });

// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), '- Hola amigo, como estas?', err => {
//     if (err) throw err;
//     console.log('Write complete.');

//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n- Amigoo!? Meeh, puta madre!', err => {
//         if (err) throw err;
//         console.log('Append complete.');
//     });

//     fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'chat.txt'), err => {
//         if (err) throw err;
//         console.log('Rename complete.');
//     });
// });

// exit on uncaught errors

process.on('uncaughtException', (err) => {
  console.log(`There was an uncaught error: ${err}`);
  process.exit(1);
});

// const math = require('./math');

// math.add(2, 3);
// math.subtract(2, 3);
// math.multiply(2, 3);
// math.divide(4, 2);

// console.log(__dirname);
// console.log(__filename);
// console.log(path.dirname(__filename));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));

// console.log(path.parse(__filename));
