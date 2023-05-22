const events = require('events');
const logEvents = require('./logEvents');

const eventEmitter = new events.EventEmitter();

eventEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
  eventEmitter.emit('log', 'Log event emitted!');
}, 2000);
