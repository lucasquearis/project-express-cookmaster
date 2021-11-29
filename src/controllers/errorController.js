const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, _req, res, _next) => {
  const { code, message } = err;
  if (code && message) return res.status(code).json({ message });
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno' });
};

module.exports = { errorHandler };