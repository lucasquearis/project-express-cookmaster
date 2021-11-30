const express = require('express');
const { create } = require('../controllers/users/create');
const { validateUser } = require('../middlewares/validateUser');

const usersRouter = express.Router({ mergeParams: true });

usersRouter.post('/', validateUser, create);

module.exports = { usersRouter };