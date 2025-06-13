const mongoose = require('mongoose');

const PollSchema = mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, "Please enter poll name"]
        }

    }

);

const Poll = mongoose.model("Poll", PollSchema);
module.exports = Poll;