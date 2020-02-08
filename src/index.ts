import "reflect-metadata";
import {createConnection} from "typeorm";

import * as cors from 'cors'
import { web3, initialize as initializeEthereum } from './ethereum';

const express = require('express');

const app = express();
const routes = require('./routes');






// import * as WebSocket from 'ws';

// const wss = new WebSocket.Server({ server: app });

// wss.on('connection', (ws) => {

//   //connection is up, let's add a simple simple event
//   ws.on('message', (message: string) => {
//     ws.send(`Hello, you sent -> ${message}`);
//   })


// });




app.use(express.json());
app.use(cors());
// Connect all our routes to our application
app.use(routes)


async function run() {
  await createConnection('default')
  console.log('DB connection established')

  initializeEthereum().then(x => {
    console.log(`Initialized Ethereum contracts`)
  })

  // Turn on that server!
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  })
}


run()