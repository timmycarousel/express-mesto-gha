const User = require('../models/user');

const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;

// GET /users - возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .json({ message: 'Внутренняя ошибка сервера' });
    });
};

// GET /users/:userId - возвращает пользователя по _id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).json(user);
    })
    .catch(() => {
      res.status(ERROR_CODE).json({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    });
};

// POST /users - создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(ERROR_CODE).json({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    });
};

// PATCH /users/me - обновляет информацию о пользователе
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params.userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).json(user);
    })
    .catch(() => {
      res
        .status(ERROR_CODE)
        .json({
          message: 'Переданы некорректные данные при создании пользователя',
        });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
};
