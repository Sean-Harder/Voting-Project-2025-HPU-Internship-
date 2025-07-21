import express from 'express';
import mongoose from 'mongoose';
import { userResponse } from '../models/response.model.js'; // Adjust path if needed

const router = express.Router();

// POST /api/submitVote/:id
router.post('/api/submitVote/:id', async (req, res) => {
  try {
    const pollId = req.params.id;
    const { selectedOption, deviceId } = req.body;

    // --- Validation ---
    if (!pollId || !selectedOption || !deviceId) {
      return res.status(400).json({ message: 'Poll ID, selected option, and device ID are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid poll ID format' });
    }

    // --- Prevent Duplicate Votes by Device ---
    const existingVote = await userResponse.findOne({ poll_id: pollId, device_id: deviceId });
    if (existingVote) {
      return res.status(409).json({ message: 'You have already voted on this poll from this device.' });
    }

    // --- Save Vote ---
    const newVote = new userResponse({
      poll_id: pollId,
      option_selected: selectedOption,
      device_id: deviceId,  // ✅ Save device ID
      submitted_at: new Date()
    });

    const savedVote = await newVote.save();

    return res.status(201).json({
      message: 'Vote submitted successfully',
      data: savedVote.toObject()
    });

  } catch (err) {
    console.error('Error submitting vote:', err.message);
    return res.status(500).json({
      message: 'Failed to submit vote',
      error: err.message
    });
  }
});

export default router;
