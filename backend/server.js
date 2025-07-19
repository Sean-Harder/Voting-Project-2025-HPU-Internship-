import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

//const cors = require('cors');
import {mongoURI} from './config.js';
import deletePoll from './routes/deletePoll.js'
import getMyPolls from './routes/getMyPolls.js'
import checkViewPoll from './routes/checkViewPoll.js'
import submitVote from './routes/submitVote.js';
// import Poll from './models/poll.model.js';

const app = express()
const port = 3000
app.use(express.json())

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.use('/scripts', express.static(path.join(dirname, '..', 'scripts')));
app.use(express.static(path.join(dirname, '..')));

// Serve index.html manually
app.get('/', (req, res) => {
    res.sendFile(path.join(dirname, '..', 'votepage.html'));
});


mongoose.connect(`${mongoURI}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Connected'),

        app.use(deletePoll)
        app.use(getMyPolls)
        app.use(checkViewPoll)
        app.use(submitVote)


        app.listen(port, () => {
            console.log(`App is running at http://localhost:${port}`);
        });
    })
    .catch((error) => console.error('Error Connecting to Mongoose: ', error))