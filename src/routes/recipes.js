const express = require('express');

const { authenticateLogin } = require('../middlewares/authenticateLogin');
const { create } = require('../controllers/recipes/create');
const { validateRecipe } = require('../middlewares/validateRecipe');
const { list } = require('../controllers/recipes/list');
const { getById } = require('../controllers/recipes/getById');
const { update } = require('../controllers/recipes/update');

const recipesRouter = express.Router({ mergeParams: true });

recipesRouter.post('/', validateRecipe, authenticateLogin, create);
recipesRouter.get('/', list);
recipesRouter.get('/:id', getById);
recipesRouter.put('/:id', authenticateLogin, validateRecipe, update);

module.exports = { recipesRouter };