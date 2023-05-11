const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, index: true }
});


module.exports = mongoose.model("users", userSchema);

//A user's email should not appear more than once in your collection (i.e. use a unique index)
//A user should only need an email and password field.