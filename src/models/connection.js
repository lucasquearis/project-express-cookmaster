const { MongoClient } = require('mongodb');

require('dotenv').config();

const MONGO_DB_URL = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;
const DB_NAME = 'Cookmaster';

let schema = null;

const connection = async () => (
  schema ? Promise.resolve(schema) : MongoClient.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((conn) => conn.db(DB_NAME))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    })
);

module.exports = connection;