const { StatusCodes } = require('http-status-codes');
const putImageService = require('../../services/recipes/putImage');

const putImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization;
    const result = await putImageService.putImage(id, token);
    res.status(StatusCodes.OK).json(result);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { putImage };