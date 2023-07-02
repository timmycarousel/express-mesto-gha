const User = require('../models/user');

const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;

// GET /users - возвращает всех пользователей
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(SERVER_ERROR_CODE).json({ message: 'Внутренняя ошибка сервера' });
  }
};

// GET /users/:userId - возвращает пользователя по _id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(SERVER_ERROR_CODE).json({ message: 'Внутренняя ошибка сервера' });
  }
};

// POST /users - создаёт пользователя
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные при создании пользователя' });
  }
};

// PATCH /users/me - обновляет информацию о пользователе
const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, about },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные при обновлении профиля' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
};
