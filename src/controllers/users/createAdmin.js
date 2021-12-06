const { StatusCodes } = require('http-status-codes');
const serviceCreateAdmin = require('../../services/users/createAdmin');

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { headers: { authorization } } = req;
    const newAdmin = await serviceCreateAdmin.createAdmin(name, email, password, authorization);
    res.status(StatusCodes.CREATED).json(newAdmin);
  } catch (error) {
    next(error);
  }
};

module.exports = { createAdmin };