// createNote(userId, noteObj) - should create a note for the given user
// getNote(userId, noteId) - should get note for userId and noteId (_id)
// getUserNotes(userId) - should get all notes for userId

const Note = require('../models/note');

module.exports.createNote = async (userId, noteObj) => {
    const note = new Note({
        userId,
        text: noteObj.text
    });
    return await note.save();
};

module.exports.getNote = async (userId, noteId) => {
    return await Note.findOne({ _id: noteId, userId }).exec();
};

module.exports.getUserNotes = async (userId) => {
    return await Note.find({ userId }).exec();
};

