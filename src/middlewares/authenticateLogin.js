const jwt = require('jsonwebtoken');

const segredoSuperSecreto = 'fogaçaémelhor';

const authenticateLogin = (req, _res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, segredoSuperSecreto);
  if (decoded) next();
};

module.exports = { authenticateLogin };