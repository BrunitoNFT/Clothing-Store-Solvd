[![Continous integration pipeline](https://github.com/BrunitoNFT/Clothing-Store-Solvd/actions/workflows/CI.yml/badge.svg)](https://github.com/BrunitoNFT/Clothing-Store-Solvd/actions/workflows/CI.yml)

# API Documentation for Clothing Store Online

- [API Documentation (Postman)](https://documenter.getpostman.com/view/23436771/2s9YR3cavw)

## Requisites to run the project:

- Docker installed

```bash
 docker --version
 # Normal output: Docker version 24.0.2
```

- Run command `npm install`

### Scripts

Development mode JS, automatic typescript compilation and files passed to docker. The js code compiled runs inside docker. The server is restarted with nodemon inside docker.

```bash
  npm run dev
```

Production mode JS, changes in the local machine are not reflected inside the docker container. Server is ran with the last dist version before running the command in docker.

```bash
  npm start
```

All test are executed.

```bash
  npm test
```

A code analysis with eslint rules is executed

```bash
  npm run lint
```

Dist folder is deleted and compiled again

```bash
  npm run build
```

## Environment Variables

To run this project, you will need a .env file with the following environment variables on it.

`DATABASE_URL_CONTAINER = mongodb://mongo_db:27017`
`PORT = 8080`
`NODE_ENV = production`
`SECRET_PASSWORD = thisisthesecretandtemporarykey`
`JWT_EXPIRES_IN = 30d`
`JWT_COOKIE_EXPIRES_IN = 30d`

## TODO:

- ✅ Transfrom jsonwebtoken to a handcraft library
- ✅ Migrate js to typescript
- ✅ Pagination and query features
- ✅ Dockerize the application
- Integrate auth to mongo container
- Personal image
- Comment, buy, review a product by a user
- Login with google

## TODO course:

- ✅ DB SQL squema with data types and conections.
- ✅ Create a sql script to create all the database with tables following the grafic schema.
- ✅ Create script to create more convinient indexes in mongodb and explain why.
- ✅ Add CI/CD - Github Actions
- Add unit testing with 65% coverage
