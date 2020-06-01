const Mongoose = require('mongoose');

const USERS = new Mongoose
  .Schema(require('./user'), { collection: 'userCollection' });

module.exports = {
  createdAt: { type: Date, required: true },
  user: { type: USERS, required: true },
  value: { type: String, required: true },
};
