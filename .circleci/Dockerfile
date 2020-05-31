FROM lambdadeveloper/compilouit:node AS BUILDER

LABEL maintainer="John Murowaniecki <john@compilou.com.br>"
LABEL codeAuthor="John Murowaniecki <john@compilou.com.br>"

WORKDIR /worker
COPY ./ /worker

RUN yarn install

FROM lambdadeveloper/compilouit:node AS web

COPY --from=0 /worker       /application

CMD [ "yarn", "run", "start" ]
