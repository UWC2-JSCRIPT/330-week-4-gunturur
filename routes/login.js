const { Router } = require("express");
const router = Router();

const userDAO = require('../daos/user');

router.post('lo')

// Signup: POST /login/signup
// Login: POST /login
// Logout: POST /login/logout
// Change Password POST /login/password

// POST /signup - should use bcrypt on the incoming password. Store user with their email and encrypted password, handle conflicts when the email is already in use.
// POST / - find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.
// POST /password - If the user is logged in, store the incoming password using their userId
// POST /logout - If the user is logged in, invalidate their token so they can't use it again (remove it)

// isLoggedIn(req, res, next) - should check if the user has a valid token and if so make req.userId = the userId associated with that token. The token will be coming in as a bearer token in the authorization header (i.e. req.headers.authorization = 'Bearer 1234abcd') and you will need to extract just the token text. Any route that says "If the user is logged in" should use this middleware function.