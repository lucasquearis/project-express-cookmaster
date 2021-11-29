const { StatusCodes } = require('http-status-codes');

const errorHandler = (_err, _req, res, _next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno' });
};

module.exports = { errorHandler };