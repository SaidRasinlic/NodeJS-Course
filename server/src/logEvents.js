const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = async (message, logName) => {
  const logItem = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
  } catch (error) {
    console.error(error);
  }
};

module.exports = logEvents;
