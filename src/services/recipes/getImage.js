const { StatusCodes } = require('http-status-codes');
const { getById } = require('../../models/recipes/getById');

const verifyRecipeHelper = async (id) => (!!await getById(id));

const inexistentRecipe = {
  code: StatusCodes.NOT_FOUND,
  message: 'recipe not found!',
};

const getImage = async (id) => {
  const [splitedId] = id.split('.', 1);
  const recipeExists = await verifyRecipeHelper(splitedId);
  if (!recipeExists) throw inexistentRecipe;
  return 'Ok';
};

module.exports = { getImage };