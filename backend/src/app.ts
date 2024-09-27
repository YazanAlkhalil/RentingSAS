import express = require('express');
require('dotenv').config();
const cors = require('cors');
const ParseServer = require('parse-server').ParseServer;
const app = express();
const server = require('http').createServer(app);

import mobileAuth = require('./cloudCode/utils/mobileAuth');

async function main(): Promise<void> {
  const config: any = {
    // liveQuery: {
    //   classNames: ['Msg'],
    // },
    auth: {
      continueWithMobileAuth: {
        enabled: true,
        module: mobileAuth,
      },
    },
    // loggerAdapter: LoggerAdapter,
    databaseURI: process.env.databaseURI,
    appName: process.env.appName,
    appId: process.env.appId,
    restAPIKey: process.env.restAPIKey,
    cloud: './build/src/cloudCode/main.js',
    masterKey: process.env.masterKey,
    javascriptKey: process.env.javascriptKey,
    serverURL: process.env.serverURL,
    masterKeyIps: ['::/0', '0.0.0.0/0'],
    publicServerURL: process.env.publicServerURL,
    mountPath: '/api',
    allowClientClassCreation: true,
  };

  const api = new ParseServer(config);
  await api.start();
  app.use(cors());
  app.use('/api', api.app);

  
  server.listen(1337, function () {
    console.log('The Server is up and running on port 1337.');
  });
  // ParseServer.createLiveQueryServer(server);
}


main();

console.log('---app.js File Initialized---');
