const { StatusCodes } = require('http-status-codes');
const listService = require('../../services/recipes/list');

const list = async (_req, res, next) => {
  try {
    const recipes = await listService.list();
    res.status(StatusCodes.OK).json(recipes);
  } catch (error) {
    next(error);
  }
};

module.exports = { list };