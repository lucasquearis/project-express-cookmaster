const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const segredoSuperSecreto = 'fogaçaémelhor';

const emptyTokenError = {
  code: StatusCodes.UNAUTHORIZED,
  message: 'missing auth token',
};

const authenticateLogin = (req, _res, next) => {
  const token = req.headers.authorization;
  if (!token) return next(emptyTokenError);
  const decoded = jwt.verify(token, segredoSuperSecreto);
  if (decoded) next();
};

module.exports = { authenticateLogin };