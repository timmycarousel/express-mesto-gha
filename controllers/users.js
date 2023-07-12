const bcrypt = require('bcrypt');
const User = require('../models/user');
const { getJwtToken } = require('../helpers/jwt');

const ERROR_CODE = 400;

// POST /users - создаёт пользователя
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res
      .status(ERROR_CODE)
      .send({ message: 'email или пароль не могут быть пустые' });
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(409)
          .send({ message: 'пользователь с таким email уже зарегистрирован' });
      }
      return (
        bcrypt
          .hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
          // eslint-disable-next-line no-shadow
          .then((user) => {
            res.status(200).send(user);
          })
          .catch((err) => Promise.reject(err))
      );
    })
    .catch(() => {
      res.status(ERROR_CODE).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODE)
      .send({ message: 'email или пароль не могут быть пустые' });
  }

  return (
    User.findOne({ email })
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (!user) return res.status(401).send({ message: 'неверный логин или пароль' });
        bcrypt.compare(password, user.password, (error, isValidPassword) => {
          if (!isValidPassword) return res.status(401).send({ message: 'ошибка пароля' });

          const token = getJwtToken(user.id);
          return res.status(200).send({ token });
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      })
  );
};

// GET /users - возвращает всех пользователей
const getUsers = (req, res) => {
  // if (!isAuthorized(req.headers.autorization)) return res.status(401).send({ message: 'Вы не авторизованы' });
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
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  updateUserAvatar,
};
