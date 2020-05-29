const Router = require('../../src/routes');
const {
  // λ,
  // expect
} = require('src/...');

'Valida Router.'
  .testList(function () {

    'Injeta apenas métodos registrados'.test(function (done) { this.skip(); done(); });
    'Valida se o escopo dos métodos está correto'.test(function (done) { this.skip(); done(); });
    'Cria nova rota e verifica se ela recebe cookie'.test(function (done) { this.skip(); done(); });
    'Valida emissão de eventos pro Socket.IO'.test(function (done) { this.skip(); done(); });

    context('Possíveis falhas', function () {
      'Permanência do cookie'.test(function (done) { this.skip(); done(); });
      'Segurança do cookie/sessão'.test(function (done) { this.skip(); done(); });
      'Repressão/limite de acesso (anti-abuso)'.test(function (done) { this.skip(); done(); });
      'Cluster não gerencia a quantidade real/total de usuários conectados (acima de 40k)'.test(function (done) { this.skip(); done(); });
    });
  });
