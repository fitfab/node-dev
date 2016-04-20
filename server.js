var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');

// We need to add a configuration to our proxy server,
// as we are now proxying outside localhost
var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
const PORT = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

// Point to our static assets
app.use(express.static(publicPath));

// If you only want this for development, you would of course
// put it in the "if" block below
app.all('/db/*', function (req, res) {
  proxy.web(req, res, {
    target: 'https://fitfab.firebaseio.com'
  });
});

// We only want to run the workflow when not in production
if (!isProduction) {

  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea
  var bundle = require('./server/bundle.js');
  bundle();

  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
  });

}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

// Run the server
app.listen(PORT, () => console.log('Server running on port ' + PORT));






// *****************************************
// 'use strict';

// const express = require('express');

// // Constants
// const PORT = 8080;

// // App
// const app = express();
// app.get('/', function (req, res) {
//   res.send('Hello world\n');
// });

// app.listen(PORT);
// console.log('Running on http://localhost:' + PORT);