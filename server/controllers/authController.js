const bcrypt = require("bcrypt")
const User = require("../models/User")
const {
	generateAccessToken,
	generateRefreshToken,
	setTokens,
	generateResponse,
} = require("../helpers/authHelpers")

const register = async (req, res) => {
	try {
		const { username, password } = req.body
		const userExists = await User.exists({ username: username })

		if (userExists) {
			return res
				.status(409)
				.send(generateResponse(false, "User already exists"))
		}

		const hash = await bcrypt.hash(password, 10)
		await User.create({ username: username, password: hash })

		const accessToken = generateAccessToken(username)
		const refreshToken = generateRefreshToken(username, 0)
		setTokens(res, accessToken, refreshToken)

		return res.send(generateResponse(true, "User created!"))
	} catch (err) {
		return res.status(500).send(
			generateResponse(false, "Problem creating user", {
				error: err,
			})
		)
	}
}

const login = async (req, res) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username: username })

		if (!user) {
			return res
				.status(404)
				.send(generateResponse(false, "User not found"))
		}

		const isValid = await bcrypt.compare(password, user["password"])

		if (!isValid) {
			return res
				.status(401)
				.send(generateResponse(false, "Invalid password"))
		}

		const newVersion = user["refreshTokenVersion"] + 1

		await User.updateOne(
			{ username: username },
			{ $set: { refreshTokenVersion: newVersion } }
		)

		const accessToken = generateAccessToken(username)
		const refreshToken = generateRefreshToken(username, newVersion)
		setTokens(res, accessToken, refreshToken)
		return res.send(generateResponse(true, "User logged in!"))
	} catch (err) {
		return res.status(500).send(
			generateResponse(false, "Problem logging in user", {
				error: err,
			})
		)
	}
}

const logout = async (req, res) => {
	try {
		const { username } = req.body
		await User.updateOne(
			{ username: username },
			{ $inc: { refreshTokenVersion: 1 } }
		)
		setTokens(res, "", "", true)

		return res.send(generateResponse(true, "Successfully logged out!"))
	} catch (err) {
		return res.status(500).send(
			generateResponse(false, "Problem logging out user", {
				error: err,
			})
		)
	}
}

const isLoggedIn = (req, res) => {
	return res.send(
		generateResponse(true, "User is logged in!", {
			username: req.body["username"],
		})
	)
}

module.exports = { register, login, logout, isLoggedIn }
