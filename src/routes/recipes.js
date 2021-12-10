const express = require('express');
const multer = require('multer');
const path = require('path');

const { authenticateLogin } = require('../middlewares/authenticateLogin');
const { create } = require('../controllers/recipes/create');
const { validateRecipe } = require('../middlewares/validateRecipe');
const { list } = require('../controllers/recipes/list');
const { getById } = require('../controllers/recipes/getById');
const { update } = require('../controllers/recipes/update');
const { remove } = require('../controllers/recipes/delete');
const { putImage } = require('../controllers/recipes/putImage');

const recipesRouter = express.Router({ mergeParams: true });
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, callback) => {
    const { id } = req.params;
    callback(null, `${id}.jpeg`);
  },
});
const upload = multer({ storage });

recipesRouter.post('/', validateRecipe, authenticateLogin, create);
recipesRouter.get('/', list);
recipesRouter.get('/:id', getById);
recipesRouter.put('/:id', authenticateLogin, validateRecipe, update);
recipesRouter.put(
  '/:id/image', authenticateLogin, putImage, upload.single('image'),
);
recipesRouter.delete('/:id', authenticateLogin, remove);

module.exports = { recipesRouter };