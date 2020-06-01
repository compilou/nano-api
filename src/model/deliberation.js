const Mongoose = require('mongoose');

const VOTES = new Mongoose
  .Schema(require('./vote'), { collection: 'voteCollection' });


module.exports = {
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  text: { type: String, required: true },
  votes: { type: [VOTES], required: false },
  dummy: { type: Boolean, required: false },
};
