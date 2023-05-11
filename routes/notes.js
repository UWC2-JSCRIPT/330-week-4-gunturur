//   Notes (requires authentication)
// Create: POST /notes
// Get all of my notes: GET /notes
// Get a single note: GET /notes/:id

// POST / - If the user is logged in, it should store the incoming note along with their userId
// GET / - If the user is logged in, it should get all notes for their userId
// GET /:id - If the user is logged in, it should get the note with the provided id and that has their userId

// Error handling - router.use(error, req, res, next) - Can be used to handle errors where the provided note id is not a valid ObjectId. This can be done without middleware though.

const express = require('express');
const router = express.Router();
const notesDAO = require('../daos/note');
const isLoggedIn = require('./auth');
const TokenDAO = require('../daos/token'); 

router.post('/', isLoggedIn, async (req, res, next) => {
  const tokenString = req.headers['authorization'].split(' ')[1]; 
  const userId = await TokenDAO.getUserIdFromToken(tokenString);
  if (!userId) return res.status(401).send('Unauthorized');
  const noteObj = req.body;
  if (!noteObj) return res.status(400).send('noteObj is required');
  try {
      const note = await notesDAO.createNote(userId, noteObj);
      res.json(note);
  } catch (error) {
      next(error);
  }
});

router.get('/', isLoggedIn, async (req, res, next) => {
  const tokenString = req.headers['authorization'].split(' ')[1];
  const userId = await TokenDAO.getUserIdFromToken(tokenString);
  if (!userId) return res.status(401).send('Unauthorized');
  try {
      const notes = await notesDAO.getUserNotes(userId);
      res.json(notes);
  } catch (error) {
      next(error);
  }
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
  const tokenString = req.headers['authorization'].split(' ')[1];
  const userId = await TokenDAO.getUserIdFromToken(tokenString);
  if (!userId) return res.status(401).send('Unauthorized');
  const noteId = req.params.id;
  if (!noteId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).send('Invalid note ID');
  }
  try {
      const note = await notesDAO.getNote(userId, noteId);
      if (!note) return res.sendStatus(404);
      res.json(note);
  } catch (error) {
      next(error);
  }
});

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
});

module.exports = router;

