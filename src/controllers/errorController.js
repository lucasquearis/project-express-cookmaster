const { StatusCodes } = require('http-status-codes');

const incorrectJwtError = {
  code: StatusCodes.UNAUTHORIZED,
  message: '',
};

const errorHandler = (err, _req, res, _next) => {
  if (err.message.includes('jwt')) {
    incorrectJwtError.message = err.message;
    return res.status(incorrectJwtError.code).json({ message: incorrectJwtError.message });
  }
  const { code, message } = err;
  if (code && message) return res.status(code).json({ message });
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno' });
};

module.exports = { errorHandler };