const { StatusCodes } = require('http-status-codes');

const nameHelper = (name) => (!!name);
const preparationHelper = (preparation) => (!!preparation);
const ingredientsHelper = (ingredients) => (!!ingredients);

const invalidEntriesError = {
  message: 'Invalid entries. Try again.',
  code: StatusCodes.BAD_REQUEST,
};

const validateRecipe = (req, _res, next) => {
  const { name, preparation, ingredients } = req.body;
  const arrayParams = [
    nameHelper(name),
    preparationHelper(preparation),
    ingredientsHelper(ingredients),
  ];
  const someError = arrayParams.some((element) => element === false);
  return someError ? next(invalidEntriesError) : next();
};

module.exports = { validateRecipe };