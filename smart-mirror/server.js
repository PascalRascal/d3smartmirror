'use strict';

var watsonApp = require('./main.js');

// Deployment tracking
require('cf-deployment-tracker-client').track();

var port = process.env.VCAP_APP_PORT || 3000;
watsonApp.listen(port);
console.log('listening at:', port);
