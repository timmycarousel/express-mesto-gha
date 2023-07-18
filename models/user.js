const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Слишком длинное имя'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Мало символов'],
    maxlength: [30, 'Много символов'],
    default: 'Исследователь океана',
  },
  avatar: {
    type: String,
    default:
      'https://www.pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректный формат ссылки',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Введен некорректный адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
