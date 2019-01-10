const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev })
const handle = app.getRequestHandler()

function createServer() {
  const server = express();

  // server.use('/_next', express.static(path.join(__dirname, '.next')))

  // server.use(function (req, res, next) {
  //   req.url = req.originalUrl.replace('prod/_next', '_next');
  //   next(); // be sure to let the next middleware handle the modified request. 
  // });

  // add middleware, custom routing, whatever
  server.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => handle(req, res));
  return server;
}

if (process.env.IN_LAMBDA) {
  module.exports = createServer();
} else {
  app.prepare().then(() => {
    const server = createServer();
    server.listen(port);
  });
}