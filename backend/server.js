import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
//const cors = require('cors');
import { mongoURI } from './config.js';
const app = express()
const port = 3000
app.use(express.json())
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
// const pollSchema = new mongoose.Schema({
//     question: String,

// })

// const Poll = mongoose.model('poll', pollSchema);

// app.delete('/polls/:id', async (req, res) => {
//     try {
//         console.log('Attempting to delete poll ID:', req.params.id);
//         const result = await Poll.findByIdAndDelete(req.params.id);
//         console.log('Delete result:', result);

//         if (!result) {
//             return res.status(404).json({ message: 'Poll not found' });
//         }

//         res.status(200).json({ message: 'Poll deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error deleting poll', error: err.message });
//     }
// });

