const HttpError = require('../models/HttpError');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Shhhh');
    }
    const decodedToken = jwt.verify(token, 'supersecret');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed', 401);
    return next(error);
  }
};
