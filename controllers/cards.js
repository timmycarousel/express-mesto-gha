const Card = require('../models/card');

// GET /cards - возвращает все карточки
const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// POST /cards - создаёт карточку
const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ error: 'Переданы некорректные данные при создании карточки' });
  }
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      return res.status(404).json({ error: 'Передан несуществующий _id карточки' });
    }
    return res.status(200).json(card);
  } catch (error) {
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

// PUT /cards/:cardId/likes - добавляет лайк карточке
const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error: 'Переданы некорректные данные для постановки/снятия лайка' });
  }
};

// DELETE /cards/:cardId/likes - убирает лайк с карточки
const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error: 'Переданы некорректные данные для снятия лайка' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
