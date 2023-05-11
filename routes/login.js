

// Signup: POST /login/signup
// Login: POST /login
// Logout: POST /login/logout
// Change Password POST /login/password

// POST /signup - should use bcrypt on the incoming password. Store user with their email and encrypted password, handle conflicts when the email is already in use.
// POST / - find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.
// POST /password - If the user is logged in, store the incoming password using their userId
// POST /logout - If the user is logged in, invalidate their token so they can't use it again (remove it)

// isLoggedIn(req, res, next) - should check if the user has a valid token and if so make req.userId = the userId associated with that token. The token will be coming in as a bearer token in the authorization header (i.e. req.headers.authorization = 'Bearer 1234abcd') and you will need to extract just the token text. Any route that says "If the user is logged in" should use this middleware function.


const { Router } = require("express");
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const Token = require('../models/token');

const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const isLoggedIn = require('./auth');


router.post('/signup', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email and password are required');
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    try {
      const user = await userDAO.createUser({ email, password: hashedPassword });
      res.json(user);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).send('Email already exists');
      }
      next(err);
    }
  });
      

router.post('/', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Email and password are required');

  const user = await userDAO.getUser(email);
  if (!user) return res.status(401).send('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send('Invalid email or password');

  const token = uuid();

  // Save the token to the Token model
  const tokenInstance = new Token({
    token: token,
    userId: user._id, 
  });
  
  try {
    await tokenInstance.save();
  } catch (err) {
    console.error('Error saving token:', err);
    return res.status(500).send('Error saving token');
  }

  res.json({ token });
});
  
  
router.post('/password', isLoggedIn, async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Authorization header is required');

    const userId = await tokenDAO.getUserIdFromToken(token);
    console.log('userID:', userId);
    if (!userId) return res.status(401).send('Invalid token');

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email and password are required');

    if (password.trim() === '') return res.status(400).send('Password should not be empty');

    const user = await userDAO.getUser(email);
    if (!user) return res.status(401).send('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send('Password not valid');

    if (user._id.toString() !== userId) {
        return res.status(401).send('Invalid token');
    }

    const newToken = await tokenDAO.makeTokenForUserId(user._id);
    res.json({ token: newToken });
});

router.post('/logout', isLoggedIn, async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('No token provided');
  
    try {
      await tokenDAO.removeToken(token);
      res.status(200).send('User logged out');
    } catch (err) {
      console.error('Error during logout:', err);
      res.status(500).send('Error during logout');
    }
  });

module.exports = router;
