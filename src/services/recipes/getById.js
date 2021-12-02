const getByIdModel = require('../../models/recipes/getById');

const recipeError = {
  code: 404,
  message: 'recipe not found',
};

const getById = async (id) => {
  const recipe = await getByIdModel.getById(id);
  if (!recipe) throw recipeError;
  return recipe;
};

module.exports = { getById };