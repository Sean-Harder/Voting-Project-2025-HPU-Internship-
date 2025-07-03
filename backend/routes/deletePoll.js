// DELETE route
import express from 'express';
const router = express.Router()
import { Poll } from '../models/poll.model.js';
import mongoose from 'mongoose';



router.delete('/api/poll/:id', async (req, res) => {
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

export default router;