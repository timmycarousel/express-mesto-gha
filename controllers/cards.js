const Card = require('../models/card');

const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;

// GET /cards - возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).json(cards);
    })
    .catch(() => {
      res.status(SERVER_ERROR_CODE).json({ error: 'Ошибка сервера' });
    });
};

// POST /cards - создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).json(card);
    })
    .catch(() => {
      res
        .status(ERROR_CODE)
        .json({ error: 'Переданы некорректные данные при создании карточки' });
    });
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .json({ error: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).json(card);
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .json({ error: 'Внутренняя ошибка сервера' });
    });
};

// PUT /cards/:cardId/likes - добавляет лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).json(card);
    })
    .catch(() => {
      res.status(ERROR_CODE).json({
        error: 'Переданы некорректные данные для постановки/снятия лайка',
      });
    });
};

// DELETE /cards/:cardId/likes - убирает лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).json(card);
    })
    .catch(() => {
      res
        .status(ERROR_CODE)
        .json({ error: 'Переданы некорректные данные для снятия лайка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
