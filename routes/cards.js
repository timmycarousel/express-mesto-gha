const express = require("express");
const router = express.Router();
const { getCards, createCard, deleteCard } = require("../controllers/cards");

// Получение всех карточек
router.get("/", getCards);

// Создание карточки
router.post("/", createCard);

// Удаление карточки по идентификатору
router.delete("/:cardId", deleteCard);

module.exports = router;
