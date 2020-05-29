module.exports = {
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  text: { type: String, required: true },
  votes: { type: Array, required: false },
};
