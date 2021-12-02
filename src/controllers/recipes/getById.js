const { StatusCodes } = require('http-status-codes');
const getByIdService = require('../../services/recipes/getById');

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipes = await getByIdService.getById(id);
    res.status(StatusCodes.OK).json(recipes);
  } catch (error) {
    next(error);
  }
};

module.exports = { getById };