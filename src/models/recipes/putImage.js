const { ObjectId } = require('mongodb');
const connection = require('../connection');

const putImage = (id, image) => connection()
    .then((db) => db.collection('recipes').findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      {
        $set: {
          image,
        },
      },
      {
        returnOriginal: false,
      },
    ))
    .then(({ value }) => value);

module.exports = { putImage };