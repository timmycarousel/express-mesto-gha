const User = require('../models/user');

const ERROR_CODE = 400;

// GET /users — возвращает всех пользователей

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res
      .status(ERROR_CODE)
      .json({ message: 'Ошибка при получении пользователей' });
  }
};

// GET /users/:userId - возвращает пользователя по _id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(ERROR_CODE).json({ message: 'Ошибка при получении пользователя' });
  }
};

// POST /users — создаёт пользователя
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(ERROR_CODE).json({ message: 'Ошибка при создании пользователя' });
  }
};

// PATCH /users/:userId - обновляет профиль пользователя
const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, about },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(ERROR_CODE).json({ message: 'Ошибка при обновлении профиля пользователя' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
};
