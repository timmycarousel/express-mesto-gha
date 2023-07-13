const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(cookieParser());

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.Authorization.replace('Bearer ', '');
  console.log(req.cookies);

  if (!token) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'strong-secret');
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен авторизации' });
  }

  req.user = payload;

  next();
};

module.exports = { auth };
