// DELETE route
import express from 'express';
const router = express.Router()
import { Poll } from '../models/poll.model.js';


router.get('/api/poll/device/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params
        if (!deviceId) {
            res.status(400).json({ message: 'Error with device ID' })
        } else {
            console.log('Received deviceId:', deviceId);
        }

        const polls = await Poll.find({ device_id: deviceId})

        if (polls.length === 0) {
            res.status(404).json({ message: 'No Polls Found', data: null });
            return null
        } else {
            res.status(200).json({ message: 'Polls Returned', data: polls });
            return polls;
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching polls', error: err.message, data: null });
    }
});

export default router;