const {
  λs,
  expect,
  extract
} = require('../../src/...');

const {
  SandboxUsers,
  // SandboxCPF,
} = require('../../src/lib/utils');

const {
  APP_URL = 'http://localhost',
  PORT = 80,
} = process.env;

const target = [APP_URL, PORT].join(':');
const Plug = λs(target);
const User = SandboxUsers[0];

// const InvalidUser = ((u) => (u.password = 'invalid!', u))(extract(User, ['username', 'password']));

// const CPFs = Array(10)
//   .fill(1)
//   .map(() => SandboxCPF());

'Cadastros e controle de atas de assembléias, etc..'
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

    after(function (done) {
      this.timeout(5000);
      Plug
        .post('/auth')
        .send({})
        .end((error, response) => {
          if (error) {
            return done(new Error(error));
          }
          expect(response.statusCode).to.equal(200);
          done();
        });
    });

    'Endpoint ativo'
      .test((next) => Plug
        .options('/meeting')
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(200);
          next();
        }));

    'Sessão permanece'
      .test((next) => Plug
        .get('/auth')
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(200);
          next();
        }));

    'Publica nova assembléia para agora'
      .test((next) => Plug
        .post('/meeting')
        .send({
          title: 'Assembléia Geral Extraordinária de teste',
          description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet reprehenderit autem, asperiores odio temporibus corporis quasi facere et? Nihil doloremque obcaecati, quibusdam quaerat dolor beatae sapiente optio modi similique quas.',
          sheduled: new Date(),
          notify: true,
          status: true,
          time: '20:00',
          call: '19:00',
          deliberations: [
            { text: 'Revitalização da fachada.' },
            { text: 'Substituição das lixeiras de forma a facilitar separação dos tipos de rejeitos.' },
            { text: 'Pintura das cercas internas.' },
            { text: 'Repintura das marcações do estacionamento.' }
          ]
        })
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(201);
          next();
        }), 5000);

    'Publica nova assembléia para amanhã'
      .test((next) => Plug
        .post('/meeting')
        .send({
          title: 'Assembléia Geral Extraordinária de teste pra amanhã',
          description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet reprehenderit autem, asperiores odio temporibus corporis quasi facere et? Nihil doloremque obcaecati, quibusdam quaerat dolor beatae sapiente optio modi similique quas.',
          sheduled: new Date((new Date()).setDate((new Date()).getDate()+1)),
          notify: true,
          status: true,
          time: '20:00',
          call: '19:00',
          deliberations: []
        })
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          expect(response.statusCode).to.equal(201);
          next();
        }), 5000);

    'Lista apenas assembléias do dia seguinte'
      .test((next) => Plug
        .get('/meeting')
        .send({sheduled: new Date((new Date()).setDate((new Date()).getDate()+1)).toLocaleDateString()})
        .end((error, response) => {
          if (error) {
            return next(new Error(error));
          }
          console.log('exect at least 1', response.body);
          expect(response.statusCode).to.equal(200);
          next();
        }));

    'Adiciona nova assembléia'
      .test((next) => next());

    'Edita assembléia'
      .test((next) => next());

    'Exclui assembléia'
      .test((next) => next());

    if (!process.env.skip) {
      context('Regras de negócio mais refinadas que ficarão pra v2', function () {
        'Eventos disparados por datas limite e/ou ações dos usuários;'.test(function (next) { this.skip(); next(); });
        'Se a data estiver em um limite próximo (x dias/horas) os dados da ata são congelados;'.test(function (next) { this.skip(); next(); });
        'Ou os demais usuários - CPFs, - poderão solicitar adiamento;'.test(function (next) { this.skip(); next(); });
        'O evento só pode ser cancelado ou adiado até x dias/horas de antecedência;'.test(function (next) { this.skip(); next(); });
        'A pauta em votação/destaque só pode ser alterada até determinado momento;'.test(function (next) { this.skip(); next(); });

        'O secretário/admin pode realizar ações além do controle da votação.'.test(function (next) { this.skip(); next(); });
        'Interações que agreguem valor ao documento final como..'.test(function (next) { this.skip(); next(); });
        'Adentos/comentários durante a sessão (vinculados a reunião de forma geral ou a deliberação ativa);'.test(function (next) { this.skip(); next(); });
        'O secretário (ou algum serviço) ao identificar um usuário ocioso poder sinalizar diretamente (Socket.IO);'.test(function (next) { this.skip(); next(); });

        'Também estava pensando em algumas automatizações, como serviços de atualização de estado das reuniões:'.test(function (next) { this.skip(); next(); });
        'Se faltar quorum a reunião será adiada para determinada data - onde os participantes poderão eleger;'.test(function (next) { this.skip(); next(); });
        'Integração com serviços de comunicação como o SIMET/CIn-UFPE, iQ-Anatel para avaliar problemas de comunicação e melhores estratégias de votação (visto que um socket em uma conexão instável seria impraticável);'.test(function (next) { this.skip(); next(); });
        'Integração com OpenWeather, MetSul, Advisor etc.. Pra informar a previsão do tempo pra determinadas datas - com temporal a internet geralmente fica oscilando e pra votação/rtc isso é terrível;'.test(function (next) { this.skip(); next(); });
        'Integração com agendas do Google+, e outros serviços de gerenciamento e redes sociais - pra finalidades diversas, como notificação, identificação, etc..'.test(function (next) { this.skip(); next(); });
      });
    }


  });


'Acesso como usuário comum.'
  .testList(() => {

    'Dashboard com a reunião ativa.'
      .test(function (next) {
        this.skip();
        next();
      });

    'Listagem das próximas reuniões.'
      .test(function (next) {
        this.skip();
        next();
      });

    'Notificações pessoas e para o grupo.'
      .test(function (next) {
        this.skip();
        next();
      });

    'Acesso aos resumos de sessões anteriores.'
      .test(function (next) {
        this.skip();
        next();
      });

    context('Interação com reunião ativa', function () {
      'Interação com sessão ativa.'
        .test(function (next) {
          this.skip();
          next();
        });

      'Voto computado.'
        .test(function (next) {
          this.skip();
          next();
        });

      'Tentativa de burlar e votar novamente.'
        .test(function (next) {
          this.skip();
          next();
        });

      'Anti-flood da sessão.'
        .test(function (next) {
          this.skip();
          next();
        });
    });

    if (!process.env.skip) {
      context('Regras de negócio mais refinadas que ficarão pra v2', function () {
        'Vinculação com biometria e controle gestual para sessões presenciais;'.test(function (next) { this.skip(); next(); }); });
      'Integração com weareable - ex. xiami band, samsumg gear'.test(function (next) { this.skip(); next(); });
      'Assessiblidade - visual e motora'.test(function (next) { this.skip(); next();
      });
    }
  });
