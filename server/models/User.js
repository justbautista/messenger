const mongoose = require("mongoose")

const userScehma = new mongoose.Schema({
    username: String,
    password: String,
    refreshTokenVersion: Number,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    chatRooms: [mongoose.Schema.Types.ObjectId],
})

module.exports = mongoose.model("User", userScehma)