const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const router = require('express').Router();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

app.use(bodyParser.json());

// Подключение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb');

// Мидлвэр для временного решения авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '649ea3ecd26dda6c5255abeb',
  };
  next();
});

// Обработчик GET-запроса на корневой URL
app.get('/', (req, res) => {
  res.send('Привет, мир!!!!');
});

app.post('/signin', login);

app.post('/signup', createUser);

// Регистрация маршрутов
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Запуск сервера на порту 3000
app.listen(3000);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страницы не существует' });
});

app.use((err, req, res) => {
  if (err.status === 400) {
    res.status(400).json({ message: 'Переданы некорректные данные' });
  }
  if (err.status === 404) {
    res.status(404).json({ message: 'Ресурс не найден' });
  }
  res.status(500).json({ message: 'На сервере произошла ошибка' });
});

module.exports = app;
