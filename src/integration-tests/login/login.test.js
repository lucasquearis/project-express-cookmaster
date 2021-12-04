const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', async () => {
  const DBServer = new MongoMemoryServer();

  before(async() => {
    const URLMock = await DBServer.getUri();
      const connectionConfig = { useNewUrlParser: true, useUnifiedTopology: true };
      const connectionMock = await MongoClient.connect(URLMock, connectionConfig);
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      const db = await connectionMock.db('Cookmaster');
      const users = await db.collection('users');
      await users.insertOne({ email: 'lucas@hotmail.com', password: '123456' });
  });
  after(async () => {
    MongoClient.connect.restore();
    const URLMock = await DBServer.getUri();
    const connectionConfig = { useNewUrlParser: true, useUnifiedTopology: true };
    const connectionMock = await MongoClient.connect(URLMock, connectionConfig);
    const db = await connectionMock.db('Cookmaster');
    const users = await db.collection('users');
    await users.deleteMany({});
  });
  describe('Quando não é inserido o campo "email" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
            password: "string"
          });
    })
    it('Retorna o código de status 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("All fields must be filled");
    });
  });
  describe('Quando não é inserido o campo "password" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
            email: "lucas@hotmail.com",
          });
    })
    it('Retorna o código de status 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("All fields must be filled");
    });
  });
  describe('Quando é inserido o campo "email" não valido é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
            email: 'lucas.com',
            password: "string"
          });
    })
    it('Retorna o código de status 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Incorrect username or password");
    });
  });
  describe('Quando é inserido o campo "senha" inválido é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
            email: 'lucas@hotmail.com',
            password: 'string'
          });
    });
    it('Retorna o código de status 401', () => {
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Incorrect username or password");
    });
  });
  describe('Quando o login é feito com sucesso', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
            email: 'lucas@hotmail.com',
            password: '123456'
          });
    });
    it('Retorna o código de status 200', () => {
      expect(response).to.have.status(StatusCodes.OK);
    });
    it('Retorna um objeto token', () => {
      const { body } = response;
      expect(body).to.have.all.deep.keys('token');
    });
  });
});
