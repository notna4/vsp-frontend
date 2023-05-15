const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/xml-data',
    createProxyMiddleware({
      target: 'http://localhost:80/',
      changeOrigin: true,
      pathRewrite: {
        '^/xml-data': 'https://www.bnr.ro/nbrfxrates.xml', // replace with the actual path to the XML data
      },
    })
  );
};