const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy cho API 1
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://minhhk.id.vn',
      changeOrigin: true,
    })
  );

  // // Proxy cho API 2
  // app.use(
  //   '/api1',
  //   createProxyMiddleware({
  //     target: 'http://localhost:5004',
  //     changeOrigin: true,
  //   })
  // );

};
