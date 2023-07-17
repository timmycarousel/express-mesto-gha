const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { auth } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

// Подключение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

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

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).json({ message: 'Переданы некорректные данные' });
  }
  if (err.status === 404) {
    res.status(404).json({ message: 'Ресурс не найден' });
  }
  res.status(500).json({ message: 'На сервере произошла ошибка' });
});

module.exports = app;
