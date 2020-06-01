const {
  λs,
  expect,
} = require('../../src/...');

const {
  SandboxCPF,
} = require('../../src/lib/utils');

const {
  APP_URL,
  PORT = 80,
} = process.env;

const target = [APP_URL || 'http://localhost', PORT].join(':');
const Plug = λs(target);

const CPFs = Array(10)
  .fill(1)
  .map(() => SandboxCPF());

'Cadastros e controle de atas de assembléias, etc..'
  .testList(function () {

    before(function (done) {
      this.retries(3);
      this.timeout(5000);


      Plug
        .post('/auth')
        .send({ username: CPFs.pop() })
        .end((error, response) => {
          if (error) {
            return done(new Error(error));
          }
          expect([200, 201]).contains(response.statusCode);
          expect(response).to.have.cookie('session');
          done();
        });
    });

    'Endpoint ativo'
      .test((next) => {
        Plug
          .get('/vote')
          .end((error, response) => {
            if (error) {
              return next(new Error(error));
            }
            expect(response.statusCode).to.equal(200);
            setTimeout(next, 1000);
          });
      });

    context('Carrega sessão de teste', function () {

      var Sessions;

      before((done) => {
        Plug
          .get('/meeting')
          .end((error, response) => {
            if (error) {
              return done(new Error(error));
            }
            expect(response.statusCode).to.equal(200);
            Sessions = response.body;
            setTimeout(done, 1500);
          });
      });

      after((done) => {
        Plug
          .post('/vote')
          .send({ _id: Sessions[0]._id })
          .end((error, response) => {
            if (error) {
              return done(new Error(error));
            }
            expect(response.statusCode).to.equal(200);
            console.log('resumo da votação', response.body);
            setTimeout(done, 1500);
          });
      });


      'Realiza votação'
        .test((next) => {
          const voting = {
            _id: Sessions[0]._id,
            deliberation: {
              _id: Sessions[0].deliberations[0]._id,
              value: 'Sim'
            }};
          console.log('efetuando voto em', voting);
          Plug
            .put('/vote')
            .send(voting)
            .end((error, response) => {
              if (error) {
                return next(new Error(error));
              }
              expect(response.statusCode).to.equal(200);
              console.log('voto', response.body);
              // next();
              setTimeout(next, 1500);
            });
        });
    });


  });
