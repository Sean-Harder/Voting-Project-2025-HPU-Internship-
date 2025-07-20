import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema(
  {
    poll_question: {
      type: String,
      required: [true, 'Poll question is required'],
    },
    poll_description: {
      type: String,
      default: '',
    },
    poll_options: {
      type: [String],
      required: [true, 'Poll options are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 2;
        },
        message: 'Poll must have at least two options',
      },
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'polls' }
);

export const Poll = mongoose.model('Poll', PollSchema);
