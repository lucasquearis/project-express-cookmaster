const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const segredoSuperSecreto = 'fogaçaémelhor';

const notAdminError = {
  code: StatusCodes.FORBIDDEN,
  message: 'Only admins can register new admins',
};

const emptyTokenError = {
  code: StatusCodes.UNAUTHORIZED,
  message: 'missing auth token',
};

const validateAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next(emptyTokenError);
  const decoded = jwt.verify(token, segredoSuperSecreto);
  if (decoded.role !== 'admin') next(notAdminError);
  if (decoded) next();
};

module.exports = { validateAdmin };
