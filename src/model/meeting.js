module.exports = {
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  lastChanged: { type: Date, required: false },
  title: { type: String },
  description: { type: String, required: false },
  sheduled: { type: Date, required: false },
  notify: { type: Boolean, required: false },
  status: { type: Boolean, required: false },
  time: { type: String, required: false },
  call: { type: String, required: false },
  deliberations: [{
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: false },
    text: { type: String, required: true },
    votes: [{
      createdAt: { type: Date, required: true },
      user: { type: Object },
      value: { type: Boolean, required: true },
    }],
  }]
};
