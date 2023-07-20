const router = require('express').Router();
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const { linkRegex } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.use(cookieParser());

// GET /users — возвращает всех пользователей
router.get('/', auth, getUsers);

router.get('/me', auth, getUserInfo);

// GET /users/:userId - возвращает пользователя по _id
router.get(
  '/:userId',
  auth,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUserById,
);

// PATCH /users/:userId - обновляет профиль пользователя
router.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser,
);

// PATCH /users/me/avatar - обновляет аватар пользователя
router.patch(
  '/me/avatar',
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(linkRegex).required(),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
