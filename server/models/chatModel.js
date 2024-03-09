// import { model, Schema } from "mongoose";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const chatSchema = Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    {
        timestamps: true,
    }
)

// module.exports = mongoose.model("Chat", chatModel);
export default model("Chat", chatSchema);