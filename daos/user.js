// createUser(userObj) - should store a user record
// getUser(email) - should get a user record using their email
// updateUserPassword(userId, password) - should update the user's password field

const mongoose = require('mongoose');

const User = require('../models/user');

module.exports.createUser = (userObj) => {
    return User.create(userObj);
}

module.exports.getUser = (email) => {
    return User.findOne({ email: email });
    // return User.findById(userId);
}

module.exports.updateUserPassword = (userId, password) => {
    return User.findByIdAndUpdate(userId, { password: password });
}