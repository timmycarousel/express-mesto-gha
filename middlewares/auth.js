const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/jwt');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен авторизации' });
  }
};

module.exports = { auth };
