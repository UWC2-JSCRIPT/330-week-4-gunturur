const { Router } = require("express");
const router = Router();

const notesDAO = require('../daos/note');

module.exports.getAll = (page, perPage) => {
    return Note.find().limit(perPage).skip(perPage*page).lean();
  }
  
  module.exports.getById = (noteID) => {
    if (!mongoose.Types.ObjectId.isValid(noteID)) {
      return null;
    }
    return Author.findOne({ _id: noteID }).lean();
  }


//   Notes (requires authentication)
// Create: POST /notes
// Get all of my notes: GET /notes
// Get a single note: GET /notes/:id

// POST / - If the user is logged in, it should store the incoming note along with their userId
// GET / - If the user is logged in, it should get all notes for their userId
// GET /:id - If the user is logged in, it should get the note with the provided id and that has their userId

// Error handling - router.use(error, req, res, next) - Can be used to handle errors where the provided note id is not a valid ObjectId. This can be done without middleware though.