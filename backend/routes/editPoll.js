// backend/routes/editPoll.js
import express from 'express';
import mongoose from 'mongoose';
import { Poll } from '../models/poll.model.js';

const router = express.Router();

// update by _id or device_id
// mounted at /api/poll -> this becomes PUT /api/poll/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let updated = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Poll.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }
    if (!updated) {
      updated = await Poll.findOneAndUpdate({ device_id: id }, updates, { new: true, runValidators: true });
    }
    if (!updated) return res.status(404).json({ message: 'Poll not found' });

    res.json({ message: 'Poll updated', poll: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating poll', error: err.message });
  }
});

export default router;
