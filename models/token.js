const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("tokens", tokenSchema);

//A user should be able to have multiple tokens, which allows them to log in and out on multiple browsers/devices at the same time (i.e. do not use a unique index)