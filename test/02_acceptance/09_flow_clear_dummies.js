const {
  λs,
  expect,
  extract
} = require('../../src/...');

const {
  SandboxUsers,
} = require('../../src/lib/utils');

const {
  APP_URL,
  PORT = 80,
} = process.env;

const target = [APP_URL || 'http://localhost', PORT].join(':');
const Plug = λs(target);
const User = SandboxUsers[0];

'Limpa cadastros de teste'
  .testList(function () {

    before(function (done) {
      this.retries(3);
      this.timeout(5000);

      Plug
        .post('/auth')
        .send(extract(User, ['username', 'password']))
        .end((error, response) => {
          if (error) {
            return done(new Error(error));
          }
          expect(response.statusCode).to.equal(200);
          expect(response).to.have.cookie('session');
          done();
        });
    });

    'Deleta usuários (CPFs) de teste'
      .test((next) => Plug
        .delete('/user')
        .send({ dummy: true })
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(202);
          next();
        }));

    'Deleta sessões/agendamentos de teste'
      .test((next) => Plug
        .delete('/meeting')
        .send({ dummy: true })
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(202);
          next();
        }));
  });
