const { StatusCodes } = require('http-status-codes');
const deleteRecipeService = require('../../services/recipes/delete');

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization;
    const response = await deleteRecipeService.remove(id, token);
    res.status(StatusCodes.NO_CONTENT).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { remove };