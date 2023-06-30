const express = require('express');

const router = express.Router();
const Card = require('./Card');

// GET /cards — возвращает все карточки
router.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// POST /cards — создаёт карточку
router.post('/cards', async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete('/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    await Card.findOneAndDelete({ _id: cardId, owner: req.user._id });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

module.exports = router;
