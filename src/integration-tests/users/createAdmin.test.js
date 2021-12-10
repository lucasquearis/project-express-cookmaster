const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const server = require('../../api/app');
const { StatusCodes } = require('http-status-codes');
const MongoClientMock = require('../connectionMock');


chai.use(chaiHttp);

const { expect } = chai;

describe('POST /users/admin', () => {
  let token;
  let tokenADM;
  before(async() => {
    const connectionMock = await MongoClientMock()
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
    const db = await connectionMock.db('Cookmaster')
    const users = await db.collection('users');
    await users.deleteMany({});
    const recipes = await db.collection('recipes');
    await recipes.deleteMany({});
    await users.insertOne({
      name: "lucasAdm",
      email: "lucasadm@hotmail.com",
      password: "admin12345",
      role: 'admin',
    });
    await users.insertOne({
      name: "lucas",
      email: "lucas@hotmail.com",
      password: "123456",
      role: 'user',
    });
    tokenADM = await chai.request(server)
      .post('/login')
      .send({
        email: "lucasadm@hotmail.com",
        password: "admin12345"
      });
    token = await chai.request(server)
      .post('/login')
      .send({
        email: "lucas@hotmail.com",
        password: "123456",
      });
  });
  after(async () => {
    MongoClient.connect.restore();
  });
  describe('Quando tenta criar um admin não sendo admin', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users/admin')
        .send({
            name: "admin",
            email: "admin@hotmail.com",
            password: "adm1234"
        })
        .set('authorization', token.body.token);
    })

    it('Retorna o código de status 403', () => {
      expect(response).to.have.status(StatusCodes.FORBIDDEN);
    });
    it('Retorna um objeto message', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('message')
    });
    it('Retorna um erro' , () => {
      const { body: { message } } = response;
      expect(message).to.be.equal('Only admins can register new admins');
    });
  });
  describe('Quando cria um admin corretamente', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server)
        .post('/users/admin')
        .send({
            name: "admin",
            email: "admin@hotmail.com",
            password: "adm1234"
        })
        .set('authorization', tokenADM.body.token);
    })
    it('Retorna o código de status 201', () => {
      expect(response).to.have.status(StatusCodes.CREATED);
    });
    it('Retorna um objeto user', () => {
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('user')
    });
    it('Retorna todos os atributos do user' , () => {
      const { body: { user } } = response;
      expect(user).to.have.all.deep.keys('name', 'email', 'role', '_id');
    });
  })
});