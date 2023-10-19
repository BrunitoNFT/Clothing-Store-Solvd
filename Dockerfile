FROM node:alpine
WORKDIR /usr/src/app
COPY dist .
COPY package*.json .
COPY .env .
RUN npm ci
CMD [ "node", "server.js" ]