import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  poll_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Poll'
  },
  option_selected: {
    type: String,
    required: true
  },
  device_id: {
    type: String,
    required: true
  },
  submitted_at: {
    type: Date,
    default: Date.now
  }
});

// Collection name explicitly set to "Responses"
export const userResponse = mongoose.model("userResponse", responseSchema, 'Responses');