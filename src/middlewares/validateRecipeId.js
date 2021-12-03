const { getById } = require('../services/recipes/getById');

const validateRecipeId = async (req, res, next) => {
  const { id } = req.params;
  const result = await getById(id);
  if (result) return next();
};

module.exports = { validateRecipeId };