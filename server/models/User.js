const mongoose = require("mongoose")

const userScehma = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	refreshTokenVersion: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		immutable: true,
		default: () => Date.now(),
	},
	chatRooms: [
		{
			room: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Chat",
			},
			read: {
				type: Boolean,
			},
		},
	],
})

module.exports = mongoose.model("User", userScehma)
