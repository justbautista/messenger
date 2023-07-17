const { generateJsonResponse } = require("../helpers/authHelpers")
const User = require("../models/User")

const searchUsers = async (req, res) => {
	try {
		const { user } = req.query

		if (!user) {
			return res
				.status(400)
				.send(generateJsonResponse(false, "Invalid or empty query"))
		}

		const results = await User.aggregate([
			{
				$search: {
					index: "searchUsers",
					text: {
						path: "username",
						query: user,
						fuzzy: {},
					},
				},
			},
			{
				$limit: 10,
			},
			{
				$project: {
					_id: 0,
					username: 1,
				},
			},
		])

		if (results.length === 0) {
			return res
				.status(404)
				.send(generateJsonResponse(false, "No users found"))
		}

		const resultList = results.map((result) => result["username"])

		return res.send(
			generateJsonResponse(true, "Found user(s)!", { users: resultList })
		)
	} catch (err) {
		return res
			.status(500)
			.send(
				generateJsonResponse(false, "Problem with fetching users", {
					error: err,
				})
			)
	}
}

module.exports = { searchUsers }
