const express = require('express');
const playersController = require('../../controllers/playersController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

const router = express.Router();

router.route('/')
  .get(playersController.getAllPlayers)
  .post(verifyRoles(ROLES_LIST.admin), playersController.createNewPlayer)
  .put(playersController.updatePlayer)
  .delete(playersController.deletePlayer);

router.route('/:id')
  .get(playersController.getPlayer);

module.exports = router;
