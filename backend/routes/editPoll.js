// backend/routes/editPoll.js
import express from 'express';
import mongoose from 'mongoose';
import { Poll } from '../models/poll.model.js';

const router = express.Router();

// PUT /api/poll/:id - update an existing poll
router.put('/api/poll/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid poll ID format' });
    }

    const updates = req.body;

    const updatedPoll = await Poll.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPoll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json({ message: 'Poll updated successfully', poll: updatedPoll });
  } catch (err) {
    console.error('Error updating poll:', err);
    res.status(500).json({ message: 'Error updating poll', error: err.message });
  }
});

export default router;
