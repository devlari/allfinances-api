FROM prounion/oracle-node:20.9.0

ENV API_HOST=""

RUN apt-get update -y && \
  apt-get install -y procps git gpg gnupg2 gpg-agent && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g npm && \
  npm install -g dotenv-cli

USER node

WORKDIR /usr/src/api

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

CMD ["npx", "ts-node", "-P", "./tsconfig.json", "src/main/routes.ts"]