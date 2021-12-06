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

const validateAdmin = (token) => {
  if (!token) throw emptyTokenError;
  const decoded = jwt.verify(token, segredoSuperSecreto);
  if (decoded.role !== 'admin') throw notAdminError;
  return true;
};

const createUserModel = require('../../models/users/create');

const createAdmin = async (name, email, password, token) => {
  validateAdmin(token);
  const newUser = await createUserModel.create(name, email, password, 'admin');
  const { role, _id } = newUser;
  return { user: { name, email, role, _id } };
};

module.exports = { createAdmin };