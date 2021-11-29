const express = require('express');
const { create } = require('../controllers/users/create');
const { authenticatorUsers } = require('../middlewares/authenticatorUsers');

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post('/', authenticatorUsers, create);

module.exports = { usersRouter };