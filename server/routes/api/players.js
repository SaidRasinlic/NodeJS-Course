const express = require('express');
const playersController = require('../../controllers/playersController');

const router = express.Router();

router.route('/')
  .get(playersController.getAllPlayers)
  .post(playersController.createNewPlayer)
  .put(playersController.updatePlayer)
  .delete(playersController.deletePlayer);

router.route('/:id')
  .get(playersController.getPlayer);

module.exports = router;
