**μ API** trata-se de um [teste de conhecimentos](https://github.com/SoftdesignBrasil/avalicao-tecnica-backend-v1/issues/1), a demonstração pode ser [acessada aqui](#Demonstração).



[url-dockerhub]: https://hub.docker.com/repository/docker/lambdadeveloper/nano-api
[url-circleci ]: https://app.circleci.com/pipelines/github/compilou/nano-api
[url-climate  ]: https://codeclimate.com/github/jmurowaniecki/nano-api/maintainability
[url-coverage ]: https://codeclimate.com/repos/5ecd2001df417b3651002e05/test_coverage



[](BADGES)
[![DockerHub      ][ico-dockerhub]][url-dockerhub]
[![CircleCI       ][ico-circleci ]][url-circleci ]
[![Service Uptime ][ico-uptime   ]](#)
<!--
[![Maintainability][ico-climate  ]][url-climate  ]
[![Test Coverage  ][ico-coverage ]][url-coverage ]
-->



## Primeiros passos

Você pode realizar o deploy instantâneo no Heroku sem precisar instalar nada no seu ambiente de trabalho bastando utilizar o botão abaixo:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)



## _Instalação_

Após clonar o projeto execute o comando `make` no intuito de validar os requisitos do sistema e criar as variáveis de ambiente e, logo a seguir `make install` para montar os containers e `make launch` inicializar a aplicação.

> Obtenha mais informações sobre os comandos disponíveis executando `make help` em seu console.



### Configuração do ambiente

Após executar o comando `make install` seu ambiente deve estar parecido com os exemplos comentados abaixo:

```apache
PROJECT_NAME="nano-api"
# Nome deste projeto.

ENVIRONMENT=dev
# Ambiente no qual estará sendo executado.

APP_URL=http://localhost
# Endereços para direcionamento das requisições.

APP_KEY=
# Chave de identificação da aplicação.

MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_RESOURCE=
# Dados de conexão com banco MongoDB.

CC_TEST_REPORTER_ID=
# Chave para upload dos relatórios de cobertura de código.
```



## Docker // CI/CD // QA

Os containers são atualizados sempre que houver alteração nos ramos principais do repositório e estarão disponíveis publicamente no [Docker Hub][url-dockerhub] de forma automatizada via [CircleCI][url-circleci].



## Sobre
<!-- Makefile:about -->
[![linkedin ][ico-linkedin ]](https://www.linkedin.com/in/php-developer)
[![Twitter  ][ico-twitter  ]](https://twitter.com/0xD3C0D3)
[![github   ][ico-github   ]](https://github.com/jmurowaniecki)
<!-- Makefile:/about -->

Desenvolvedor apaixonado, tem fixação por quebra-cabeças e em busca constante de desafios.



[](ASSETS)

[ico-twitter  ]: https://img.shields.io/badge/Twitter-0xD3C0D3-6f42c1?style=flat-square&logo=twitter&logoColor=fff
[ico-linkedin ]: https://img.shields.io/badge/linkedin-php--developer-1488C6?style=flat-square&logo=linkedin&logoColor=fff
[ico-github   ]: https://img.shields.io/badge/github-jmurowaniecki-0366d6?style=flat-square&logo=github&logoColor=fff
[ico-dockerhub]: https://img.shields.io/badge/λ::dev-nano--api-099cec?style=flat-square&logo=docker&logoColor=fff
[ico-circleci ]: https://img.shields.io/circleci/build/github/compilou/nano-api?label=CircleCI&logo=circleci&style=flat-square&token=736a53be01d64ad18fa278679178d36914715cf3
[ico-climate  ]: https://api.codeclimate.com/v1/badges/a93239014ccf7584a262/maintainability
[ico-coverage ]: https://api.codeclimate.com/v1/badges/a93239014ccf7584a262/test_coverage
[ico-uptime   ]: https://img.shields.io/uptimerobot/ratio/m785019275-d5d7bc84d661955e87251bd5?logo=heroku&style=flat-square
