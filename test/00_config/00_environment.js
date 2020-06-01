const FS = require('fs');
const {
  λ,
  expect
} = require('src/...');
const Mongoose = require('mongoose');
const ENV_FILES = ['.env', '.env.template'];

const {
  APP_URL,
  PORT = 80,
} = process.env;

const target = [APP_URL || 'http://localhost', PORT].join(':');

const Model = require('../../src/model')([
  'user',
  'meeting',
  'deliberation',
]);


'Configurações do ambiente'
  .testList(() => {

    'Variáveis de ambiente existentes'
      .test((next) => {
        let file;

        while (FS.existsSync(file = ENV_FILES.shift())) {
          break;
        }
        FS.readFile(file, 'utf8', (err, data) => {
          if (err) {
            return next(new Error('Ocorreu um erro inesperado: ', err));
          }
          const NOT_FOUND = data
            .split('\n')
            .filter(line => line && !(line.split('=')[0] in process.env))
            .join('\n');

          if (NOT_FOUND) {
            return next(new Error([
              'As seguintes variáveis não estão devidamente configuradas:',
              NOT_FOUND
            ].join('\n\n')));
          }
          next();
        });
      });


    'Variáveis de ambiente corretas para o MongoDB'
      .test((next) => {

        const {
          MONGODB_URL = process.env.MONGODB_RESOURCE,
          MONGODB_CFG = {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            autoCreate: true,
          }
        } = process.env;

        Mongoose.connect(MONGODB_URL, MONGODB_CFG, (err) => {
          if (err) {
            return next(new Error('Não foi possível conectar no MongoDB utilizando as credenciais informadas.'));
          }
        }).then( async () => {
          if (process.env.RESET_DB) {
            const DB = Mongoose.connection.db;
            DB.collections()
              .then( async (collections) => (await collections.forEach((exact) => exact.drop())))
              .catch(() => {})
              .finally(async () => {
                await Object.keys(Model.Models)
                  .forEach((model) => DB.createCollection(Model.Schema[model], () => {
                  }));
              });
          }
          Mongoose.disconnect().then(() => {
            next();
          });
        });
      }, 5000);
  });



'Servidor web/Express e notificador/SocketIO'
  .testList(() => {


    'Validando endpoints da interface'
      .test((next) => +λ(target)
        .get('/status')
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }

          const body = JSON.parse(response.text);
          expect(body).to.have.keys(['CPU', 'RAM']);
          expect(response.statusCode, target).to.equal(200);
          next();
        }), 7000);


    'Validando página de erro'
      .test((next) => {

        +λ(target)
          .get('/errorpage')
          .end((error, response) => {
            if (error) {
              return next(new Error(error));
            }
            expect(error, target).to.null;
            expect(response.statusCode, target).to.equal(404);
            next();
          });
      });
  });
