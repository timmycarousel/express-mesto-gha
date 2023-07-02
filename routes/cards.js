const express = require('express');

const router = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Получение всех карточек
router.get('/', getCards);

// Создание карточки
router.post('/', createCard);

// Удаление карточки по идентификатору
router.delete('/:cardId', deleteCard);

// Добавление лайка карточке
router.put('/:cardId/likes', likeCard);

// Удаление лайка с карточки
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
