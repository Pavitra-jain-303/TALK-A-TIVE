import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            trim: true
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
    },
    {
        timestamps: true,
    }
);

export default model("Messages", messageSchema);