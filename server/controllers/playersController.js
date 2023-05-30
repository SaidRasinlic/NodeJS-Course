const path = require('path');
const logEvents = require('../middleware/logEvents');

const data = {
  playersData: require('../model/players.json'),
  setPlayers: function (newData) { this.playersData = newData; },
};

const getAllPlayers = (req, res) => {
  res.json(data.playersData);
};

const createNewPlayer = (req, res) => {
  const newPlayer = {
    id: data.playersData.players?.length ? `${+data.playersData.players[data.playersData.players.length - 1].id + 1}` : 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!newPlayer.firstName || !newPlayer.lastName) {
    return res.status(400).json('First and last names are required.');
  }
  data.setPlayers({ players: [...data.playersData.players, newPlayer] });
  logEvents.writeData(path.join(__dirname, '..', 'model', 'players.json'), data.playersData);
  return res.status(201).json(data.playersData);
};

const updatePlayer = (req, res) => {
  const foundPlayer = data.playersData.players.find((emp) => emp.id === req.body.id);
  if (!foundPlayer) {
    return res.status(400).json({ message: `Player ID ${req.body.id} not found.` });
  }
  if (req.body.firstName) foundPlayer.firstName = req.body.firstName;
  if (req.body.lastName) foundPlayer.lastName = req.body.lastName;
  const filteredArray = data.playersData.players.filter((player) => player.id !== req.body.id);
  const unsortedArray = [...filteredArray, foundPlayer];
  // eslint-disable-next-line no-nested-ternary
  data.setPlayers({
    // eslint-disable-next-line no-nested-ternary
    players: unsortedArray.sort((a, b) => (+a.id > +b.id ? 1 : +a.id < +b.id ? -1 : 0)),
  });
  logEvents.writeData(path.join(__dirname, '..', 'model', 'players.json'), data.playersData);
  return res.status(200).json(data.playersData);
};

const deletePlayer = (req, res) => {
  const foundPlayer = data.playersData.players.find((player) => player.id === req.body.id);
  if (!foundPlayer) {
    return res.status(400).json(`Player ID ${req.body.id} not found.`);
  }
  const filteredArray = data.playersData.players.filter((player) => player.id !== req.body.id);
  data.setPlayers({ players: [...filteredArray] });
  logEvents.writeData(path.join(__dirname, '..', 'model', 'players.json'), data.playersData);
  return res.status(200).json(data.playersData);
};

const getPlayer = (req, res) => {
  const foundPlayer = data.playersData.players.find((player) => player.id === req.params.id);
  if (!foundPlayer) {
    return res.status(400).json(`Player ID ${req.params.id} not found`);
  }
  return res.status(200).json(foundPlayer);
};

module.exports = {
  getAllPlayers,
  createNewPlayer,
  updatePlayer,
  deletePlayer,
  getPlayer,
};
