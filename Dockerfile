FROM node:alpine
WORKDIR /usr/src/app
RUN mkdir dist
COPY dist/ dist/
COPY package*.json .
COPY .env .
RUN npm ci
CMD [ "npx", "nodemon", "dist/server.js" ]