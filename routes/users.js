const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

// POST /users — создаёт пользователя
router.post('/', createUser);

// GET /users — возвращает всех пользователей
router.get('/', getUsers);

// GET /users/:userId - возвращает пользователя по _id
router.get('/:userId', getUserById);

// PATCH /users/:userId - обновляет профиль пользователя
router.patch('/:userId', updateUser);

// PATCH /users/me/avatar - обновляет аватар пользователя
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
