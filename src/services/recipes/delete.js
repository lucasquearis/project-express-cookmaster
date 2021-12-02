const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { getById } = require('../../models/recipes/getById');
const deleteRecipeModel = require('../../models/recipes/delete');

const segredoSuperSecreto = 'fogaçaémelhor';

const unauthorizedUpdateRecipeError = {
  code: StatusCodes.UNAUTHORIZED,
  message: 'impossible to make changes to non-proprietary recipes',
};

const verifyRecipeOwner = async (id) => {
  const recipe = await getById(id);
  return recipe.userId;
};

const verifyUserHelper = (token) => {
  const { _id, role } = jwt.verify(token, segredoSuperSecreto);
  return { userId: _id, role };
};

const remove = async (id, token) => {
  const ownerId = await verifyRecipeOwner(id);
  const statusUser = verifyUserHelper(token);
  if (ownerId === statusUser.userId || statusUser.role === 'admin') {
    const response = await deleteRecipeModel.remove(id);
    return response;
  }
  throw unauthorizedUpdateRecipeError;
};

module.exports = { remove };