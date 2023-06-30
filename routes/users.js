const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

// POST /users — создаёт пользователя
router.post('/', createUser);
// router.post("/", () => {
//   console.log("есть запрос");
// });

// GET /users — возвращает всех пользователей
router.get('/', getUsers);

// GET /users/:userId - возвращает пользователя по _id
router.get('/:userId', getUserById);

module.exports = router;
