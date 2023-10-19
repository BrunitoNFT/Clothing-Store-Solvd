# API Documentation for Clothing Store Online

- [API Documentation (Postman)](https://documenter.getpostman.com/view/23436771/2s9YR3cavw)

## TODO:

- ✅ Transfrom jsonwebtoken to a handcraft library
- ✅ Migrate app to typescript
- ✅ Pagination and query features
- Comment, buy, review a product by a user
- Personal image
- Dockerize the application (Option to run it with Docker)
- Login with google

## Get Started

Install libraries

```bash
  npm install
```

### Scripts

Development mode JS (Automatic typescript compilation and server runs the js code compiled.)

```bash
  npm run dev-js
```

Development mode TS ( Server runs the ts code restarting automatically while coding. It uses ts-node.)

```bash
  npm run dev-ts
```

Production mode JS ( Server runs JS folder without restarting with changes.)

```bash
  npm run start-js
```

Production mode TS ( Server runs TS folder without restarting with changes.)

```bash
  npm run start-ts
```

All test are executed.

```bash
  npm test
```

A code analysis with eslint rules is executed

```bash
  npm run lint
```

## Environment Variables

To run this project, you will need to create a .env file and add the following environment variables to it.

To have a DATABASE_URL you should create an account in mongoDB atlas and create a DB with an user and password.

`DATABASE_URL = mongodb+srv://<<DB_USER>>:<<DB_PASSWORD>>@clustersolvdclothstore.sgfq0cu.mongodb.net/?retryWrites=true&w=majority`
`PORT = 8080`
`NODE_ENV = production`
`SECRET_PASSWORD = thisisasecretpasswordbyexample`
`JWT_EXPIRES_IN = 30d`
`JWT_COOKIE_EXPIRES_IN = 30d`
