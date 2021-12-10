const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { getById } = require('../../models/recipes/getById');
const updateRecipeModel = require('../../models/recipes/update');

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

const update = async (body, id, token) => {
  const ownerId = await verifyRecipeOwner(id);
  const statusUser = verifyUserHelper(token);
  const { name, ingredients, preparation } = body;
  if (ownerId === statusUser.userId || statusUser.role === 'admin') {
    const result = await updateRecipeModel.update(name, ingredients, preparation, id);
    const responseFormat = {
      ...result,
      userId: statusUser.userId,
    };
    return responseFormat;
  }
  throw unauthorizedUpdateRecipeError;
};

module.exports = { update };