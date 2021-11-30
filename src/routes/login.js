const express = require('express');
const { loginController } = require('../controllers/login/loginController');
const { validateLogin } = require('../middlewares/validateLogin');

const loginRouter = express.Router({ mergeParams: true });

loginRouter.post('/', validateLogin, loginController);

module.exports = { loginRouter };