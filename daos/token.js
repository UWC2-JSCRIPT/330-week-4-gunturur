// makeTokenForUserId(userId) - should be an async function that returns a string after creating a Token record
// getUserIdFromToken(tokenString) - should be an async function that returns a userId string using the tokenString to get a Token record
// removeToken(tokenString) - an async function that deletes the corresponding Token record

const mongoose = require('mongoose');
const uuid = require('uuid');

const Token = require('../models/token');
const User = require('../models/user');  

module.exports.makeTokenForUserId = async (userId) => {
  const tokenString = uuid.v4(); 
  
  const token = new Token({
    token: tokenString,
    userId,
  });

  await token.save();
  
  return tokenString;
}

module.exports.getUserIdFromToken = async (tokenString) => {
  const token = await Token.findOne({ token: tokenString }).sort({ createdAt: -1 });
  if (!token) {
    return null;
  }
  const user = await User.findById(token.userId);
  if (!user) {
    return null;
  }
  return user._id.toString();
}

module.exports.removeToken = async (tokenString) => {
    await Token.deleteOne({ token: tokenString });
}