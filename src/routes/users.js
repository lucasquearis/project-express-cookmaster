const express = require('express');
const createController = require('../controllers/users/create');

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post('/', createController.create);

module.exports = { usersRouter };