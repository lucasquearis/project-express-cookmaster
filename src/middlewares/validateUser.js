const { StatusCodes } = require('http-status-codes');
const { findByEmail } = require('../models/users/findByEmail');

const errorFormat = {
  message: 'Invalid entries. Try again.',
  code: StatusCodes.BAD_REQUEST,
};

const alreadyExistsEmailFormat = {
  message: 'Email already registered',
  code: StatusCodes.CONFLICT,
};

const nameHelper = (name) => (!!name);
const passwordHelper = (password) => (!!password);
const emailHelper = (email) => {
  const validEmailRgx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  return !((!email || !validEmailRgx));
};

const validateUser = async (req, _res, next) => {
  const { name, email, password } = req.body;
  const validHelpers = [nameHelper(name), passwordHelper(password), emailHelper(email)];
  const someError = validHelpers.some((element) => element === false);
  if (await findByEmail(email)) return next(alreadyExistsEmailFormat);
  return someError ? next(errorFormat) : next();
};

module.exports = { validateUser };