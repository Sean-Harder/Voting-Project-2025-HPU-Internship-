// routes/addPoll.js
import express from 'express';
import { Poll } from '../models/poll.model.js';

const router = express.Router();


router.post('/api/addPoll', async (req, res) => {
    const { name, poll_desc, poll_response_options } = req.body;

    if (!name || !poll_desc || !poll_response_options || poll_response_options.length < 2) {
        return res.status(400).json({ message: 'Missing required fields or not enough options' });
    }

    try {
        const newPoll = new Poll({ name, poll_desc, poll_response_options });
        await newPoll.save();
        res.status(201).json({ message: 'Poll created successfully', poll: newPoll });
    } catch (err) {
        res.status(500).json({ message: 'Error creating poll', error: err.message });
    }
});

export default router;

