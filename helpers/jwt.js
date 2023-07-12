const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'secret_jwt';

const getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAuthorized = (token) => jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) return false;

  return User.findOne({ _id: decoded.id })
    .then((user) => Boolean(user));
});

module.exports = { getJwtToken, isAuthorized };
