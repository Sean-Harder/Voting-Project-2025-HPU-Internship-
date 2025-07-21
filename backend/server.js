import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import { mongoURI } from './config.js';
import deletePoll from './routes/deletePoll.js';
import getMyPolls from './routes/getMyPolls.js';
import checkViewPoll from './routes/checkViewPoll.js';
import submitVote from './routes/submitVote.js';
import addPoll from './routes/addPoll.js';

const app = express();
const port = 3000;

app.use(express.json());

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Connect to MongoDB
mongoose.connect(`${mongoURI}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Connected to MongoDB');

        // I had to register API routes BEFORE static middleware so this is the rearranged version
        app.use(addPoll);
        app.use(deletePoll);
        app.use(getMyPolls);
        app.use(checkViewPoll);
        app.use(submitVote);

        // Serve static files AFTER API routes
        app.use('/scripts', express.static(path.join(dirname, '..', 'scripts')));
        app.use(express.static(path.join(dirname, '..')));

        // Serve index.html manually on root
        app.get('/', (req, res) => {
            res.sendFile(path.join(dirname, '..', 'votepage.html'));
        });

        app.listen(port, () => {
            console.log(`App is running at http://localhost:${port}`);
        });
    })
    .catch((error) => console.error('Error Connecting to Mongoose: ', error));
