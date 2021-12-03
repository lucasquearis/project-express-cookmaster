const { StatusCodes } = require('http-status-codes');
const path = require('path');
const getImageService = require('../../services/recipes/getImage');

const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await getImageService.getImage(id);
    const options = { root: path.join(__dirname, '..', '..', 'uploads') };
    res.status(StatusCodes.OK)
      .sendFile(id, options, (err) => {
        if (err) next(err);
      });
  } catch (error) {
    next(error);
  }
};

module.exports = { getImage };