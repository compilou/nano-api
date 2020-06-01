const log = require('why-is-node-running');
const Controller = require('../../src/controllers/controller');

const {
  // λ,
  expect
} = require('./../../src/...');

var Router = require('../../src/routes');
var Routes = {
  list: {},
  log: (...msg) => !!msg,
  Server: ((...verbs) => {
    const tmp = {};
    verbs.forEach((verb) => tmp[verb] = (name, body) => {
      if (!Routes[name.replace(/^\//, '')]) {
        Routes[name.replace(/^\//, '')] = {};
      }
      Routes[name.replace(/^\//, '')][verb] = body;
    });
    return tmp;
  })('get', 'post', 'options', 'put', 'patch', 'delete'),
};

var AvailableRoutes = {
  Auth: require('../../src/controllers/auth'),
  Deliberation: require('../../src/controllers/deliberation'),
  Meeting: require('../../src/controllers/meeting'),
  User: require('../../src/controllers/user'),
  Vote: require('../../src/controllers/vote'),
};


/**
 * @description Dummy Controller class
 *
 * @class DummieController
 * @extends {Controller}
 */
class DummieController extends Controller {

  /**
   * @description Dummy method for testing injection.
   *
   * @param {any} req Express Request object.
   * @param {any} res Express Response object.
   *
   * @memberOf DummieController
   */
  options(req, res) {
    res(req);
  }

  /**
   * @description Dummy method for testing purposes.
   *
   * @param {any} ok Any data to be returned.
   * @returns {any}
   *
   * @memberOf DummieController
   */
  notInjectable(ok) {
    return ok();
  }
}



'Valida Router.'
  .testList(function () {

    'Teste de injeção'
      .test((done) => {
        Router(Routes, {
          Test: DummieController
        });
        expect(Routes.Test).to.not.have.property('notInjectable');
        expect(Routes.Test).to.have.property('options');
        Routes.Test.options('/', done);
      });


    context('Possíveis questões a serem abordadas em um ambiente mais realista', function () {
      'Valida emissão de eventos pro Socket.IO'.test(function (done) { this.skip(); done(); });
      'Segurança do cookie/sessão'.test(function (done) { this.skip(); done(); });
      'Repressão/limite de acesso (anti-abuso)'.test(function (done) { this.skip(); done(); });
      'Cluster não gerencia a quantidade real/total de usuários conectados (acima de 40k)'.test(function (done) { this.skip(); done(); });
    });

    context('Métodos definidos nos controllers', function () {
      Object.keys(AvailableRoutes).forEach((controller) => {

        `Avaliando métodos de ${controller}`
          .test((next) => {
            Router(Routes, { [controller]: AvailableRoutes[controller] });
            expect(Routes[controller]).to.have.property('get');
            next();
          });
      });
    });

    after(() => {
      setTimeout(function () {
        console.warn(log)  ; // logs out active handles that are keeping node running
      }, 1000);
    });
  });
