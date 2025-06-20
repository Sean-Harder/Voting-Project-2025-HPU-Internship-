import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

//const cors = require('cors');
import { mongoURI } from './config.js';
import { Poll } from './models/poll.model.js';
const app = express()
const port = 3000
app.use(express.json())
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.use('/scripts', express.static(path.join(dirname, '..', 'scripts')));
app.use(express.static(path.join(dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(dirname, '..', 'index.html'));
});


// Serve index.html manually
app.get('/', (req, res) => {
    res.sendFile(path.join(dirname, '..', 'index.html'));
});



mongoose.connect(`${mongoURI}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Connected'),
            app.listen(port, () => {
                console.log(`App is running at http://localhost:${port}`);
            });
    })
    .catch((error) => console.error('Error Connecting to Mongoose: ', error))


app.delete('/api/poll/:id', async (req, res) => {
    try {
        const { id } = req.params

        console.log('Received ID:', id);

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid poll ID format' });

        }
        console.log('Attempting to delete poll ID:', id);
        const result = await Poll.findByIdAndDelete(id);
        console.log('Delete result:', result);

        if (!result) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting poll', error: err.message });
    }
});

