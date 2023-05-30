const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logEvents = require('../middleware/logEvents');
require('dotenv').config();

const usersDB = {
  usersData: require('../model/users.json'),
  setUsers: function (data) { this.usersData = data; },
};

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

  const accessToken = jwt.sign(
    { username: foundUser.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30s' },
  );
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' },
  );
  // Saving refreshToken with current user
  const otherUsers = usersDB.usersData.users.filter((user) => user.username !== foundUser.username);
  const currentUser = { ...foundUser, refreshToken };

  usersDB.setUsers({ users: [...otherUsers, currentUser] });
  logEvents.writeData(path.join(__dirname, '..', 'model', 'users.json'), usersDB.usersData);
  console.log(usersDB.usersData);
  res.cookie('jwt', refreshToken, {
    httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000,
  });
  return res.json({ accessToken });
};

module.exports = { handleLogin };
