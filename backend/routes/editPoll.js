// backend/routes/editPoll.js
import express from 'express';
import mongoose from 'mongoose';
import { Poll } from '../models/poll.model.js';

const router = express.Router();

// PUT /api/editPoll/:id
router.put('/api/editPoll/:id', async (req, res) => {
  try {
    const pollId = req.params.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid poll ID format' });
    }

    const updatedPoll = await Poll.findByIdAndUpdate(
      pollId,
      {
        poll_question: updates.poll_question,
        poll_description: updates.poll_description,
        poll_options: updates.poll_options,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPoll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json({
      message: 'Poll updated successfully',
      poll: updatedPoll,
    });
  } catch (err) {
    console.error('Error updating poll:', err);
    res.status(500).json({
      message: 'Failed to update poll',
      error: err.message,
    });
  }
});

export default router;
