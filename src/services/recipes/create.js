const jwt = require('jsonwebtoken');
const createModel = require('../../models/recipes/create');

const segredoSuperSecreto = 'fogaçaémelhor';

const cathUserId = (token) => {
  const { _id } = jwt.verify(token, segredoSuperSecreto);
  return _id;
};

const create = async (name, ingredients, preparation, token) => {
  const userId = cathUserId(token);
  const recipe = await createModel.create({ name, ingredients, preparation, userId });
  return { recipe };
};

module.exports = { create };