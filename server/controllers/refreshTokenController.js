const jwt = require('jsonwebtoken');
require('dotenv').config();

const usersDB = {
  usersData: require('../model/users.json'),
  setUsers: function (data) { this.usersData = data; },
};

const handleRefreshToken = (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshTOken = cookies.jwt;

  const foundUser = usersDB.usersData.users.find(
    (user) => user.userInfo.refreshToken === refreshTOken,
  );

  if (!foundUser) return res.sendStatus(403); // Forbidden
  // evaluate jwt
  jwt.verify(
    refreshTOken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      // eslint-disable-next-line max-len
      if (err || foundUser.userInfo.username !== decoded.username) return res.sendStatus(403);

      const role = Object.values(foundUser.role);

      const accessToken = jwt.sign(
        {
          userInfo: {
            username: decoded.username,
          },
          role: role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' },
      );
      return res.json({ accessToken });
    },
  );
  return null; // just to avoid arrow func expected return err
};

module.exports = { handleRefreshToken };
