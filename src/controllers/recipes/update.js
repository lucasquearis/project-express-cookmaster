const { StatusCodes } = require('http-status-codes');
const updateRecipeService = require('../../services/recipes/update');

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization;
    const updatedRecipe = await updateRecipeService.update(req.body, id, token);
    res.status(StatusCodes.OK).json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

module.exports = { update };