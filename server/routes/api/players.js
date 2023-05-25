const express = require('express');
const fsPromises = require('fs').promises;
const path = require('path');

const router = express.Router();
const data = require('../../data/players.json');

const addPlayer = async (fileName, data) => {
  await fsPromises.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
    if (err) console.error(err);
  });
};

router.route('/')
  .get((req, res) => {
    res.json(data.players);
  })
  .post((req, res) => {
    const reqData = req.body;
    console.log(reqData);
    data.players.push(reqData);
    addPlayer(path.join(__dirname, '..', '..', 'data', 'players.json'), data);
    res.status(200).json('Player has been successfully added.');
  })
  .put((req, res) => {
    const foundPlayer = data.players.find((user) => user.id === req.body.id);

    if (foundPlayer) {
      foundPlayer.firstName = req.body.firstName;
      foundPlayer.lastName = req.body.lastName;

      data.players.splice(
        data.players.findIndex((player) => player.id === req.body.id), 1, foundPlayer,
      );

      addPlayer(path.join(__dirname, '..', '..', 'data', 'players.json'), data);
      res.status(200).json('Player has been successfully updated.');
    } else {
      res.status(400).json(`Player with ID = ${foundPlayer.id} does not exist.`);
      console.error(`Player with ID = ${foundPlayer.id} does not exist.`);
    }
  })
  .delete((req, res) => {
    const foundPlayer = data.players.find((user) => user.id === req.body.id);

    if (foundPlayer) {
      data.players.splice(
        data.players.findIndex((player) => player.id === req.body.id), 1,
      );
      addPlayer(path.join(__dirname, '..', '..', 'data', 'players.json'), data);
      res.status(200).json('Player has been successfully deleted.');
    } else {
      res.status(400).json(`Player with ID = ${foundPlayer.id} does not exist.`);
      console.error(`Player with ID = ${foundPlayer.id} does not exist.`);
    }
  });

router.route('/:id')
  .get((req, res) => {
    const foundPlayer = data.players.find((user) => user.id === req.params.id);
    if (foundPlayer) {
      res.status(200).json(foundPlayer);
    } else {
      res.status(400).json(`Player with ID = ${foundPlayer.id} does not exist.`);
      console.error(`Player with ID = ${foundPlayer.id} does not exist.`);
    }
  });

module.exports = router;
