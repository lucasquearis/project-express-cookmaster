const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');
const MongoClientMock = require('../connectionMock');


chai.use(chaiHttp);

const { expect } = chai;

describe('POST /users', async () => {
  before(async() => {
    const connectionMock = await MongoClientMock()
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    const db = await connectionMock.db('Cookmaster')
    const users = await db.collection('users');
    await users.deleteMany({});
    const recipes = await db.collection('recipes');
    await recipes.deleteMany({});
  });
  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Quando é criado com sucesso', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
            name: "string",
            email: "lucaaaas@hotmail.com",
            password: "string"
          });
    })

    it('Retorna o código de status 201', () => {
      expect(response).to.have.status(StatusCodes.CREATED);
    });
    it('Retorna um objeto user', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('user')
    });
    it('Retorna todos os dados do usuário cadastrado' , () => {
      const { body: { user } } = response;
      expect(user).to.have.all.deep.keys('name', 'email', 'role', '_id');
    });
  });
  describe('Quando não é inserido o campo "name" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
            email: "lucaas@hotmail.com",
            password: "string"
          });
    })
    it('Retorna o código de status 400', () => {
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Invalid entries. Try again.");
    });
  });
  describe('Quando não é inserido o campo "email" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
            name: "lucas",
            password: "string"
          });
    })
    it('Retorna o código de status 400', () => {
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Invalid entries. Try again.");
    });
  });
  describe('Quando é inserido o campo "email" não valido é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
            name: "lucas",
            email: 'lucas.com',
            password: "string"
          });
    })
    it('Retorna o código de status 400', () => {
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Invalid entries. Try again.");
    });
  });
  describe('Quando não é inserido o campo "senha" é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
            name: "lucas",
            email: 'lucas.com',
          });
    })
    it('Retorna o código de status 400', () => {
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Invalid entries. Try again.");
    });
  });
  describe('Quando o "email" já foi acastrado é gerado um erro', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
            name: "lucas",
            email: 'lucaaaas@hotmail.com',
            password: 'string'
          });
    })
    it('Retorna o código de status 409', () => {
      expect(response).to.have.status(StatusCodes.CONFLICT);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.all.deep.keys('message')
    });
    it('Retorna a mensagem de erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal("Email already registered");
    });
  });
});
