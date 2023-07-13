const router = require('express').Router();
const cookieParser = require('cookie-parser');
const { auth } = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

// GET /users — возвращает всех пользователей
router.get('/', getUsers);

router.use(cookieParser());

router.get('/me', getUserInfo);

// GET /users/:userId - возвращает пользователя по _id
router.get('/:userId', getUserById);

// PATCH /users/:userId - обновляет профиль пользователя
router.patch('/me', updateUser);

// PATCH /users/me/avatar - обновляет аватар пользователя
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
