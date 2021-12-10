const { StatusCodes } = require('http-status-codes');
const { login } = require('../../services/login/login');

const loginController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await login(email);
    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginController };