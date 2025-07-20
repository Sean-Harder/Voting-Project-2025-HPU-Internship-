// backend/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import editPoll from './routes/editPoll.js';
import deletePoll from './routes/deletePoll.js';
import getMyPolls from './routes/getMyPolls.js';
import checkViewPoll from './routes/checkViewPoll.js';
import submitVote from './routes/submitVote.js';
import { mongoURI } from './config.js';

const app = express();
const port = 3000;
app.use(express.json());

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// static assets
app.use('/scripts', express.static(path.join(dirname, '..', 'scripts')));
app.use(express.static(path.join(dirname, '..')));

// serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(dirname, '..', 'votepage.html'));
});

mongoose.connect(`${mongoURI}?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log('Connected');

    // mount routers
    app.use('/api/poll', editPoll);
    app.use(deletePoll);
    app.use(getMyPolls);
    app.use(checkViewPoll);
    app.use(submitVote);

    app.listen(port, () => {
      console.log(`App is running at http://localhost:${port}`);
    });
  })
  .catch(error => console.error('Error Connecting to Mongoose: ', error));
