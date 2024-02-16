import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  basePath: '/v1/api',
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['../src/modules/baseRouter.ts', '../src/modules/user/userRouter.ts', '../src/modules/login/loginRouter.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({
  autoBody: true,
  openapi: 'Enable',
  autoHeaders: true,
  autoBody: true,
})(outputFile, routes, doc);