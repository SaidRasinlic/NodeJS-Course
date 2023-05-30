const path = require('path');
const logEvents = require('../middleware/logEvents');

const usersDB = {
  usersData: require('../model/users.json'),
  setUsers: function (data) { this.usersData = data; },
};

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204); // Success - no need to return payload
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = usersDB.usersData.users.find((user) => user.refreshToken === refreshToken);

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db and clear the currentUser refreshToken
  const otherUsers = usersDB.usersData.users.filter(
    (user) => user.refreshToken !== foundUser.refreshToken,
  );
  const currentUser = { ...foundUser, refreshToken: '' };

  usersDB.setUsers({ users: [...otherUsers, currentUser] });
  logEvents.writeData(path.join(__dirname, '..', 'model', 'users.json'), usersDB.usersData);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return res.sendStatus(204);
};

module.exports = { handleLogout };
