const { StatusCodes } = require('http-status-codes');
const serviceCreate = require('../../services/users/create');

const create = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await serviceCreate.create(name, email, password);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
};

module.exports = { create };