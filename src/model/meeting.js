const Mongoose = require('mongoose');

const DELIBERATIONS = new Mongoose
  .Schema(require('./deliberation'), { collection: 'deliberationCollection' });

module.exports = {
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  lastChanged: { type: Date, required: false },
  title: { type: String },
  description: { type: String, required: false },
  sheduled: { type: Date, required: false },
  notify: { type: Boolean, required: false },
  status: { type: Boolean, required: false },
  dummy: { type: Boolean, required: false },
  time: { type: String, required: false },
  call: { type: String, required: false },
  deliberations: [DELIBERATIONS]
};
