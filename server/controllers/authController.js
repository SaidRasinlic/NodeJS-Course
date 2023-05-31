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
  const foundUser = usersDB.usersData.users.find((user) => user.userInfo.username === username);
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.userInfo.password);
  if (!match) {
    return res.status(401).json('Username and password does not match.');
  }
  // create JWTs

  const accessToken = jwt.sign(
    {
      userInfo: {
        username: foundUser.userInfo.username,
      },
      role: foundUser.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30s' },
  );

  const refreshToken = jwt.sign(
    { username: foundUser.userInfo.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' },
  );
  // Saving refreshToken with current user
  const otherUsers = usersDB.usersData.users.filter(
    (user) => user.userInfo.username !== foundUser.userInfo.username,
  );

  const currentUser = { ...foundUser, userInfo: { ...foundUser.userInfo, refreshToken } };
  // const currentUser = { ...foundUser: {refreshToken} };

  // console.log(usersDB.usersData);
  usersDB.setUsers({ users: [...otherUsers, currentUser] });
  logEvents.writeData(path.join(__dirname, '..', 'model', 'users.json'), usersDB.usersData);
  res.cookie('jwt', refreshToken, {
    httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, // secure: true - ThunderClient no need, production YES!
  });
  return res.json({ accessToken });
};

module.exports = { handleLogin };
