const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let connection = null;

const MongoClientMock = async () => {
  if (connection) return connection 
  
  const DBServer = new MongoMemoryServer();
  const URLMock = await DBServer.getUri();
  
  connection = await MongoClient.connect(URLMock,{
    useNewUrlParser: true, 
    useUnifiedTopology: true }
  )
  
  return connection
}

module.exports = MongoClientMock;