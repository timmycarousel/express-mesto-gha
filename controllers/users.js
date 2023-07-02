const User = require('../models/user');

const ERROR_CODE = 400;

// GET /users - возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(ERROR_CODE).json({
        message: ' Переданы некорректные данные при создании пользователя',
      });
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
        message: 'Переданы некорректные данные при запросе пользователя',
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
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    res.status(400).send({ message: 'Отсутствуют необходимые данные' });
  }
  if (
    req.body.name.length > 2
    && req.body.name.length < 30
    && req.body.about.length > 2
    && req.body.about.length < 30
  ) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, about: true, runValidators: true },
    )
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: 'Пользователь по указанному _id не найден' });
        }
        return res.status(200).json(user);
      })
      .catch(next);
  } else {
    res.status(400).json({ message: 'Недопустимая длина вводимых данных' });
  }
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).json(user);
    })
    .catch(() => {
      res.status(ERROR_CODE).json({
        message: ' Переданы некорректные данные при обновлении аватара',
      });
    });
};

module.exports = {
  updateUserAvatar,
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
