const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser,
} = require('../controllers/users');

// POST /users — создаёт пользователя
router.post('/', createUser);
// router.post("/", () => {
//   console.log("есть запрос");
// });

// GET /users — возвращает всех пользователей
router.get('/', getUsers);

// GET /users/:userId - возвращает пользователя по _id
router.get('/:userId', getUserById);

// PATCH /users/:userId - обновляет профиль пользователя
router.patch('/:userId', updateUser);

module.exports = router;
