import mongoose from 'mongoose'


const PollSchema = mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, "Please enter poll name"]
        }

    }

);

export const Poll = mongoose.model("Poll", PollSchema, 'polls');
// Defaults to "polls" collections (lowercase plural)