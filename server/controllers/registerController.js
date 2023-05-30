const path = require('path');
const bcrypt = require('bcrypt');
const logEvents = require('../middleware/logEvents');

const usersDB = {
  usersData: require('../model/users.json'),
  setUsers: function (data) { this.usersData = data; },
};

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json('Username and password are required.');

  const duplicate = usersDB.usersData.users.find((user) => user.username === req.body.username);

  if (duplicate) return res.status(409).json(`Conflict: User with username ${username} already exists.`);

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = { username: username, password: hashedPwd };
    usersDB.setUsers({ users: [...usersDB.usersData.users, newUser] });
    console.log(usersDB.usersData);

    logEvents.writeData(path.join(__dirname, '..', 'model', 'users.json'), usersDB.usersData);

    return res.status(201).json(`User ${username} has been successfully created!`);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { handleNewUser };
