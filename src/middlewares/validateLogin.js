const { StatusCodes } = require('http-status-codes');
const { findByEmail } = require('../models/users/findByEmail');

const invalidParams = {
  code: StatusCodes.UNAUTHORIZED,
  message: 'All fields must be filled',
};

const passwordOrEmailIncorrect = {
  code: StatusCodes.UNAUTHORIZED,
  message: 'Incorrect username or password',
};

const emailHelper = async (email) => findByEmail(email);

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(invalidParams);
  const validEmail = await emailHelper(email);
  if (!validEmail || validEmail.password !== password) return next(passwordOrEmailIncorrect);
  return next();
};

module.exports = { validateLogin };