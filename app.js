const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(bodyParser.json());

// Подключение к серверу MongoDB
mongoose
  .connect('mongodb://localhost:27017/mestodb');

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

// Регистрация маршрутов
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Запуск сервера на порту 3000
app.listen(3000, () => {
  // console.log('Сервер запущен на порту 3000');
});

module.exports = app;
