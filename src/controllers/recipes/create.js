const { StatusCodes } = require('http-status-codes');
const createRecipeService = require('../../services/recipes/create');

const create = async (req, res, next) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const token = req.headers.authorization;
    const newRecipe = await createRecipeService.create(name, ingredients, preparation, token);
    res.status(StatusCodes.CREATED).json(newRecipe);
  } catch (error) {
    next(error);
  }
};

module.exports = { create };