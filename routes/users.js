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

router.use(cookieParser());

// GET /users — возвращает всех пользователей
router.get('/', auth, getUsers);

router.get('/me', auth, getUserInfo);

// GET /users/:userId - возвращает пользователя по _id
router.get('/:userId', auth, getUserById);

// PATCH /users/:userId - обновляет профиль пользователя
router.patch('/me', auth, updateUser);

// PATCH /users/me/avatar - обновляет аватар пользователя
router.patch('/me/avatar', auth, updateUserAvatar);

module.exports = router;
