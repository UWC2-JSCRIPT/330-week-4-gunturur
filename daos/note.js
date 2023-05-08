// createNote(userId, noteObj) - should create a note for the given user
// getNote(userId, noteId) - should get note for userId and noteId (_id)
// getUserNotes(userId) - should get all notes for userId

const mongoose = require('mongoose');

const Note = require('../models/note');

module.exports.getNote = (userId, noteId) => {
    return Note.findOne({ userId, _id: noteId });
}

module.exports.getUserNotes = (userId) => {
    return Note.find({ userId });
}

module.exports.createNote = async (userId, noteObj) => {
    const note = new Note({
      _id: new mongoose.Types.ObjectId(),
      userId,
      ...noteObj,
    });
  
    return note.save();
  };
  