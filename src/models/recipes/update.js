const { ObjectId } = require('mongodb');
const connection = require('../connection');

const update = (name, ingredients, preparation, id) => connection()
    .then((db) => db.collection('recipes').updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          name,
          ingredients,
          preparation,
        },
      },
    ))
    .then((result) => result);

module.exports = { update };