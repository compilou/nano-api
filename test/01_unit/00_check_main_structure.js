const FS = require('fs');

const {
  expect
} = require('./../../src/...');

const APP = require('../../src/index');

var Resources = {};
var Routes = {};
var Application;

const RESOURCE_TYPES = {
  Cluster: {
    'Este é o processo principal': (next) => (expect(this.Cluster.isMaster).to.be.true, next()),
    'Podemos aproveitar melhor esses CORES parados': (next) => (expect(this.Cluster.fork).to.be.Function, next()),
  }
};



'Valida estrutura principal da aplicação.'
  .testList(() => {

    'Apresentação da aplicação'
      .test((done) => {
        expect(APP).to.be.instanceOf(Function);
        expect(APP.name).to.be.equal('μ');
        done();
      });

    context('Inicializa aplicação e carrega recursos', function () {
      Application = (new APP({ PORT: 666 }))
        .start((App) => {
          Object.keys(App).forEach((resource) => {
            `Recurso ${resource} carregado`.test((done) => {
              Resources[resource] = App[resource];

              `Executando recurso ${resource}`
                .testList(() => {
                  const RESOURCE = RESOURCE_TYPES[resource];
                  if (!(RESOURCE)) {
                    return `Nenhum teste provido para ${resource}`
                      .test(function (next) {
                        this.skip();
                        next();
                      });
                  }
                  Object.keys(RESOURCE)
                    .forEach((description) => {
                      `${description}`.test((next) => next());
                    });
                });

              done();
            });
          });
        });
    });

    context('Carrega rotas', function () {
      Object.keys(Routes).forEach((route) => {
        `Métodos permitidos para ${route}`.test((done) => { done();});
        `Atualizando rotas Apiary ${route}`.test((done) => { done();});
      });
    });

    'Finaliza aplicação'
      .test((done) => {
        const [whenActivePID] = [FS.existsSync('.pid')];
        expect(whenActivePID, 'O sistema está ativo').to.be.true;

        Application.shutdown('closing tests', () => {
          const inactivePID = ((FS.existsSync('.pid')));

          expect(whenActivePID, 'O sistema está desligando').to.not.be.equals(inactivePID);
          if (whenActivePID === inactivePID) {
            return done(new Error('Arquivo .pid existe - deveria ter sido deletado.'));
          }
          done();
        });
      });
  });
