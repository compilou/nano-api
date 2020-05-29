FROM lambdadeveloper/compilouit:node

LABEL maintainer="John Murowaniecki <john@compilou.com.br>"
LABEL codeAuthor="John Murowaniecki <john@compilou.com.br>"

WORKDIR /worker
COPY ./ /worker

RUN apk add curl git openssh

RUN curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > /bin/cc-test-reporter && \
    chmod +x /bin/cc-test-reporter && \
    /bin/cc-test-reporter before-build

CMD [ "yarn", "run", "λ" ]
