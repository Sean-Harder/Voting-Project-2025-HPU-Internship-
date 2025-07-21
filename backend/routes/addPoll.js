// routes/addPoll.js
import express from 'express';
import { Poll } from '../models/poll.model.js';

const router = express.Router();

// POST /api/addPoll
router.post('/api/addPoll', async (req, res) => {
    const { poll_question, poll_description, poll_options } = req.body;

    if (!poll_question || !poll_options || !Array.isArray(poll_options) || poll_options.length < 2) {
        return res.status(400).json({ message: 'Missing required fields or not enough options' });
    }

    try {
        const newPoll = new Poll({ poll_question, poll_description, poll_options });
        await newPoll.save();
        res.status(201).json({ message: 'Poll created successfully', poll: newPoll });
    } catch (err) {
        res.status(500).json({ message: 'Error creating poll', error: err.message });
    }
});

export default router;
