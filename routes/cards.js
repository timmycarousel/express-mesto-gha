const express = require('express');
const { auth } = require('../middlewares/auth');

const router = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Получение всех карточек
router.get('/', auth, getCards);

// Создание карточки
router.post('/', auth, createCard);

// Удаление карточки по идентификатору
router.delete('/:cardId', auth, deleteCard);

// Добавление лайка карточке
router.put('/:cardId/likes', auth, likeCard);

// Удаление лайка с карточки
router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;
