FROM node:18-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/auth apps/auth
COPY libs libs

CMD [ "npm", "run", "start:dev", "auth" ]