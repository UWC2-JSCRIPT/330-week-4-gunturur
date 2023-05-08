// makeTokenForUserId(userId) - should be an async function that returns a string after creating a Token record
// getUserIdFromToken(tokenString) - should be an async function that returns a userId string using the tokenString to get a Token record
// removeToken(tokenString) - an async function that deletes the corresponding Token record

const mongoose = require('mongoose');

const Token = require('../models/token');

module.exports.makeTokenForUserId = async (userId) => {
    const token = new Token({
    userId,
  });
  await token.save();
  return token.token;
}

module.exports.getUserIdFromToken = async (tokenString) => {
    const token = await Token.findOne({ token: tokenString });
  if (!token) {
    return null;
  }
  return token.userId;
}

module.exports.removeToken = async (tokenString) => {
    await Token.deleteOne({ token: tokenString });
}