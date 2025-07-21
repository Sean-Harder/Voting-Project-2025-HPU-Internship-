import mongoose from 'mongoose';

const PollSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter poll name"]
    },
    poll_desc: {
        type: String,
        required: [true, "Please enter the poll question"]
    },
    poll_response_options: {
        type: [String], // Stores options as an array, like ["Yes", "No"]
        required: [true, "Please provide poll options"]
    }
});

export const Poll = mongoose.model("Poll", PollSchema, 'polls');
