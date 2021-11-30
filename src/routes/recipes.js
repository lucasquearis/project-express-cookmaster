const express = require('express');

const { authenticateLogin } = require('../middlewares/authenticateLogin');
const { create } = require('../controllers/recipes/create');
const { validateRecipe } = require('../middlewares/validateRecipe');
const { list } = require('../controllers/recipes/list');

const recipesRouter = express.Router({ mergeParams: true });

recipesRouter.post('/', validateRecipe, authenticateLogin, create);
recipesRouter.get('/', list);

module.exports = { recipesRouter };