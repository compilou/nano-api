const {
  expect
} = require('./../../src/...');

const APP = require('../../src/index');

var Application;
var Routes;
var Resources = {};

const RESOURCE_TYPES = {
  Cluster: {
    'Este é o processo principal': (next) => (expect(this.Cluster.isMaster).to.be.true, next()),
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
                    const RESOURCE = RESOURCE_TYPES[resource]
                    if (!!RESOURCE) {
                      return Object.keys(RESOURCE)
                        .forEach((description) => {
                          `${description}`.test((next) => next());
                        });
                    }
                    `Nenhum teste provido para ${resource}`
                    .test(function (next) {
                      this.skip();
                      next();
                    });
                  })

              done();
            });
          });
        });
    });

    'Carrega rotas'
      .test((done) => {

        done();
      });

    'Finaliza'
      .test((done) => {

        done();
      });
  });
