const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const app = express();

app.use(cookieParser());

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies && req.cookies.Authorization
    ? req.cookies.Authorization.replace('Bearer ', '')
    : null;
  console.log(req.cookies);

  if (!token) {
    next(new UnauthorizedError('Неверный токен авторизации'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Неверный токен авторизации'));
  }

  req.user = payload;

  next();
};

module.exports = { auth };
