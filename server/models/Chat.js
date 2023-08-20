const mongoose = require("mongoose")

// const messageSchema = new mongoose.Schema({
//     senderUsername: {
//         type: String,
//         required: true,
//     },
//     timeStamp: {
//         type: Date,
// 		immutable: true,
// 		default: () => Date.now(),
//     },
//     message: {
//         type: String,
//         required: true,
//     }
// })

const chatScehma = new mongoose.Schema(
	{
		chatName: {
			type: String,
			required: true,
		},
		members: [String],
		messages: [
			{
				senderUsername: {
					type: String,
					required: true,
				},
				timeStamp: {
					type: Date,
					immutable: true,
					default: () => Date.now(),
				},
				message: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Chat", chatScehma)
