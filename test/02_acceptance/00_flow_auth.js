const {
  λs, λ,
  expect,
  extract
} = require('../../src/...');

const {
  SandboxUsers,
  SandboxCPF,
} = require('../../src/lib/utils');

const {
  APP_URL,
  PORT = 80,
} = process.env;

const target = [APP_URL || 'http://localhost', PORT].join(':');
const Plug = λs(target);
const User = SandboxUsers[0];

const InvalidUser = ((u) => (u.password = 'invalid!', u))(extract(User, ['username', 'password']));

const CPFs = Array(10)
  .fill(1)
  .map(() => SandboxCPF());

'Usuários administrativos'
  .testList(() => {

    'Endpoint conectado'
      .test((next) => Plug
        .head('/')
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(error, target).to.null;
          expect(response.statusCode, target).to.equal(200);
          next();
        }));

    'Tentativa de acesso com senha inválida'
      .test((next) => Plug
        .post('/auth')
        .send(InvalidUser)
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(403);
          expect(response).to.not.have.cookie('session');
          next();
        }), 5000);

    `Login com ${User.fullname}`
      .test((next) => Plug
        .post('/auth')
        .send(extract(User, ['username', 'password']))
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(200);
          expect(response).to.have.cookie('session');
          next();
        }));

    'Visualização do perfil'
      .test((next) => Plug
        .get('/auth')
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(200);
          next();
        }));

    `Logout de ${User.fullname}`
      .test((next) => Plug
        .delete('/auth')
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(200);
          next();
        }));

    'Visualização do perfil proibida quando deslogado'
      .test((next) => Plug
        .get('/auth')
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(403);
          next();
        }));
  });


'Usuários comuns'
  .testList(() => {

    'Geração de 10 CPFs de teste'
      .test((next) => {
        CPFs
          .sort()
          .sort((last, next) => last === next ? null : next)
          .filter((e) => !!e);

        expect(CPFs.length).to.equals(10);
        next();
      });

    CPFs.forEach((CPF) => `Realizando login/cadastro de ${CPF}`
      .test((next) => λ(target)
        .post('/auth')
        .set('IS-DUMMY', true)
        .send({ username: CPF, password: `${CPF}++!` })
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(201);
          expect(response).to.have.cookie('session');
          next();
        })));

    'Edição de usuário'
      .test((next) => {
        next();
      });

    'Exclusão de usuário'
      .test((next) => {
        next();
      });

    'Edição de usuário'
      .test((next) => {
        next();
      });

  });
