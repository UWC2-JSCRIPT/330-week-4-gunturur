const tokenDAO = require('../daos/token');

const isLoggedIn = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('tokenString:', token);
    if (!token) return res.status(401).send('No token is provided');
    const userId = await tokenDAO.getUserIdFromToken(token);
    console.log('userId:', userId);
    if (!userId) return res.status(401).send('Invalid token');
    req.userId = userId;
    next();
    };
module.exports = isLoggedIn;