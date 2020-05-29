module.exports = {
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  lastLogin: { type: Date, required: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  active: { type: Boolean, required: true },
  admin: { type: Boolean, required: true },
  dummy: { type: Boolean, required: false },
  email: { type: String, required: false }
};
