const usersDB = {
  usersData: require('../model/users.json'),
  setUsers: function (data) { this.users = data; },
};

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json('Username and password are required.');
  const foundUser = usersDB.usersData.users.find((user) => user.username === username);
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res.status(401).json('Username and password does not match.');
  }
  // create JWTs
  return res.json(`User ${username} is logged in!`);
};

module.exports = { handleLogin };
