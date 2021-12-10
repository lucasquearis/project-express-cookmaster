const { ObjectId } = require('mongodb');
const connection = require('../connection');

const update = (name, ingredients, preparation, id) => connection()
    .then((db) => db.collection('recipes').findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          name,
          ingredients,
          preparation,
        },
      },
      {
        returnOriginal: false,
      },
    ))
    .then(({ value }) => value);

module.exports = { update };