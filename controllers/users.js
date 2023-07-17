const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-err');
const { UnauthorizedError } = require('../errors/unauthorized-err');
const { ConflictError } = require('../errors/coflict-err');
const { BadRequestError } = require('../errors/bad-request-err');

// POST /users - создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email или пароль не могут быть пустыми');
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email или пароль не могут быть пустыми');
  }

  let foundUser; // Объявление переменной user

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким email');
      }
      foundUser = user; // Сохранение найденного пользователя в переменную
      res.clearCookie('Authorization', { httpOnly: true });
      return bcrypt.compare(password, user.password);
    })
    .then((isValidPassword) => {
      if (!isValidPassword) {
        throw new UnauthorizedError('Неверный логин или пароль');
      }
      res.clearCookie('Authorization', { httpOnly: true });
      const token = jwt.sign({ _id: foundUser.id }, 'strong-secret', {
        expiresIn: '7d',
      });
      res.cookie('Authorization', `Bearer ${token}`, { httpOnly: true });
      res.status(200).send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(200).json(user);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь c таким _id не найден');
      }
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    throw new BadRequestError('Отсутствуют необходимые данные');
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
          throw new NotFoundError('Пользователь по указанному _id не найден');
        }
        res.status(200).json(user);
      })
      .catch(next);
  } else {
    throw new BadRequestError('Недопустимая длина вводимых данных');
  }
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).json(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getUserInfo,
  updateUser,
  updateUserAvatar,
};
