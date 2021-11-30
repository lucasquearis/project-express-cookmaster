const jwt = require('jsonwebtoken');
const { findByEmail } = require('../../models/users/findByEmail');

const segredoSuperSecreto = 'fogaçaémelhor';

const jwtConfig = {
  expiresIn: '1h',
  algorithm: 'HS256',
};

const login = async (email) => {
  const { _id, role } = await findByEmail(email);
  const token = jwt.sign({ _id, email, role }, segredoSuperSecreto, jwtConfig);
  return token;
};

module.exports = { login };