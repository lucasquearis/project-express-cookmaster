const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /recipes/:id', () => {
  const DBServer = new MongoMemoryServer();
  before(async () => {
    const URLMock = await DBServer.getUri();
    const connectionConfig = { useNewUrlParser: true, useUnifiedTopology: true };
    const connectionMock = await MongoClient.connect(URLMock, connectionConfig);
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });
  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Verifica se retorna um erro ao inserir um id de receita inexistente', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .get(`/recipes/1234`);
    });
    it('Verifica se retorna o código de status correto', () => {
      expect(response).to.have.status(StatusCodes.NOT_FOUND);
    })
    it('Verifica se retorna uma mensagem de not found', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.equal('recipe not found');
    })
  });
  describe('Verifica se acha uma receita pelo id', () => {
    let receita = {};
    let token = '';
    let receitaPorId = '';
    before(async () => {
      user = await chai.request(server)
        .post('/users')
        .send({
            name: "string",
            email: "lucas@hotmail.com",
            password: "string"
          });
      token = await chai.request(server)
      .post('/login')
      .send({
          email: 'lucas@hotmail.com',
          password: 'string'
        });
      receita = await chai.request(server)
      .post('/recipes')
      .send({
          name: "frango",
          ingredients: "frango, batata",
          preparation: "frita tudo e boa"
        })
        .set('authorization', token.body.token);
      receitaPorId = await chai.request(server)
      .get(`/recipes/${receita.body.recipe._id}`);
    })
    it('Verifica se o código de status é 200', () => {
      expect(receitaPorId).to.have.status(StatusCodes.OK);
    })
    it('Verifica se o a receita tem o formato correto', () => {
      expect(receitaPorId.body).to.have.all.deep.keys('_id', 'name', 'ingredients', 'preparation', 'userId');
    })
  })
});
