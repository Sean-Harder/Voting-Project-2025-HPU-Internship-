// import { userResponse } from '../models/response.model.js'; // assumes you have a response model

// POST /api/submitVote
import express from 'express';
const router = express.Router()
import { Poll } from '../models/poll.model.js';
import mongoose from 'mongoose';

router.get('/api/checkViewPoll/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Received ID:', id);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid poll ID format' });
    }

    console.log('Attempting to checkViewPoll ID:', id);

    const result = await Poll.findById(id);

    if (!result) {
      // Send 404 JSON response if no poll found
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Send poll JSON response
    return res.json(result);

  } catch (err) {
    return res.status(500).json({ message: 'Error checking Poll', error: err.message });
  }
});


export default router;