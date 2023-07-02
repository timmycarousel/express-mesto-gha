// const Card = require('../models/card');

// const ERROR_CODE = 400;

// // GET /cards - возвращает все карточки
// const getCards = (req, res) => {
//   Card.find({})
//     .then((cards) => {
//       res.status(200).json(cards);
//     })
//     .catch((error) => {
//       res.send(error);
//     });
// };

// // POST /cards - создаёт карточку
// const createCard = (req, res) => {
//   const { name, link } = req.body;
//   Card.create({ name, link, owner: req.user._id })
//     .then((card) => {
//       res.status(201).json(card);
//     })
//     .catch(() => {
//       res.status(ERROR_CODE).json({
//         message: 'Переданы некорректные данные при создании карточки',
//       });
//     });
// };

// // DELETE /cards/:cardId - удаляет карточку по идентификатору
// const deleteCard = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         return res
//           .status(404)
//           .json({ message: ' Карточка с указанным _id не найдена' });
//       }
//       return res.status(200).json(card);
//     })
//     .catch(() => {
//       res.status(ERROR_CODE).json({
//         message: 'Переданы некорректные данные при удалении карточки',
//       });
//     });
// };

// // PUT /cards/:cardId/likes - добавляет лайк карточке
// const likeCard = (req, res) => {
//   const { cardId } = req.params;

//   if (!cardId || typeof cardId !== 'string') {
//     return res.status(ERROR_CODE).json({
//       message: 'Переданы некорректные данные для постановки/снятии лайка',
//     });
//   }

//   return Card.findByIdAndUpdate(
//     cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true, runValidators: true },
//   )
//     .then((card) => {
//       if (!card) {
//         return res
//           .status(404)
//           .json({ message: 'Передан несуществующий _id карточки' });
//       }
//       return res.status(200).json(card);
//     })
//     .catch(() => {
//       res.status(ERROR_CODE).json({
//         message: 'Переданы некорректные данные для постановки/снятии лайка',
//       });
//     });
// };

// // DELETE /cards/:cardId/likes - убирает лайк с карточки
// const dislikeCard = (req, res) => {
//   const { cardId } = req.params;

//   if (!cardId || typeof cardId !== 'string') {
//     return res
//       .status(ERROR_CODE)
//       .json({ message: 'Передан некорректный _id карточки' });
//   }

//   return Card.findByIdAndUpdate(
//     cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true, runValidators: true },
//   )
//     .then((card) => {
//       if (!card) {
//         return res
//           .status(404)
//           .json({ message: 'Карточка с указанным _id не найдена' });
//       }
//       return res.status(200).json(card);
//     })
//     .catch(() => {
//       res
//         .status(ERROR_CODE)
//         .json({ message: 'Ошибка при удалении лайка с карточки' });
//     });
// };

// module.exports = {
//   getCards,
//   createCard,
//   deleteCard,
//   likeCard,
//   dislikeCard,
// };

const Card = require('../models/card');

const ERROR_CODE = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  DEFAULT: 500,
};

// Обработчик ошибок по умолчанию
const errorHandler = (res, statusCode, message) => {
  res.status(statusCode).json({ message });
};

// GET /cards - возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).json(cards);
    })
    .catch(() => {
      errorHandler(res, ERROR_CODE.DEFAULT, 'На сервере произошла ошибка');
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
      errorHandler(
        res,
        ERROR_CODE.BAD_REQUEST,
        'Переданы некорректные данные при создании карточки',
      );
    });
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return errorHandler(
          res,
          ERROR_CODE.NOT_FOUND,
          'Карточка с указанным _id не найдена',
        );
      }
      return res.status(200).json(card);
    })
    .catch(() => {
      errorHandler(res, ERROR_CODE.DEFAULT, 'На сервере произошла ошибка');
    });
};

// PUT /cards/:cardId/likes - добавляет лайк карточке
const likeCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId || typeof cardId !== 'string') {
    return errorHandler(
      res,
      ERROR_CODE.BAD_REQUEST,
      'Переданы некорректные данные для постановки/снятии лайка',
    );
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return errorHandler(
          res,
          ERROR_CODE.NOT_FOUND,
          'Передан несуществующий _id карточки',
        );
      }
      return res.status(200).json(card);
    })
    .catch(() => {
      errorHandler(res, ERROR_CODE.DEFAULT, 'На сервере произошла ошибка');
    });
};

// DELETE /cards/:cardId/likes - убирает лайк с карточки
const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId || typeof cardId !== 'string') {
    return errorHandler(
      res,
      ERROR_CODE.BAD_REQUEST,
      'Передан некорректный _id карточки',
    );
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return errorHandler(
          res,
          ERROR_CODE.NOT_FOUND,
          'Карточка с указанным _id не найдена',
        );
      }
      return res.status(200).json(card);
    })
    .catch(() => {
      errorHandler(res, ERROR_CODE.DEFAULT, 'На сервере произошла ошибка');
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
