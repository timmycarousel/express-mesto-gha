const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { auth } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const error = require('./middlewares/error');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

// Подключение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb');

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

// Регистрация маршрутов
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

// Обработчик GET-запроса на корневой URL
app.get('/', auth, (req, res) => {
  res.send('Привет, мир!!!!');
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страницы не существует' });
});
app.use(error);
app.use(errors());

module.exports = app;
