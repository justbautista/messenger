const bcrypt = require("bcrypt")
const User = require("../models/User")
const {
	generateAccessToken,
	generateRefreshToken,
	setTokens,
	verifyRefreshToken,
} = require("../helpers/authHelpers")

const register = async (req, res) => {
	try {
		const { username, password } = req.body
		const userExists = await User.exists({ username: username })

		if (userExists) {
			return res
				.status(409)
				.send({ ok: false, message: "User already exists" })
		}

		const hash = await bcrypt.hash(password, 10)
		await User.create({ username: username, password: hash })

		const accessToken = generateAccessToken(username)
		const refreshToken = generateRefreshToken(username, 0)
		setTokens(res, accessToken, refreshToken)

		return res.send({ ok: true, message: "User created!" })
	} catch (err) {
		return res.status(500).send({
			ok: false,
			message: "Problem creating user",
			error: err,
		})
	}
}

const login = async (req, res) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username: username })

		if (!user) {
			return res
				.status(404)
				.send({ ok: false, message: "User not found" })
		}

		const isValid = await bcrypt.compare(password, user["password"])

		if (!isValid) {
			return res
				.status(401)
				.send({ ok: false, message: "Invalid password" })
		}

		await User.updateOne(
			{ username: username },
			{ $inc: { refreshTokenVersion: 1 } }
		)

		const accessToken = generateAccessToken(username)
		const refreshToken = generateRefreshToken(
			username,
			user["refreshTokenVersion"] + 1
		)
		setTokens(res, accessToken, refreshToken)

		return res.send({ ok: true, message: "User logged in!" })
	} catch (err) {
		return res.status(500).send({
			ok: false,
			message: "Problem logging in user",
			error: err,
		})
	}
}

const logout = async (req, res) => {
	try {
		const { username } = req.body
		await User.updateOne(
			{ username: username },
			{ $inc: { refreshTokenVersion: 1 } }
		)

		res.cookie("refreshToken", "", {
			httpOnly: true,
			expires: new Date(0),
		})
		return res.send({ ok: true, message: "Successfully logged out!" })
	} catch (err) {
		return res.status(500).send({
			ok: false,
			message: "Problem logging out user",
			error: err,
		})
	}
}

const test = (req, res) => {
    return res.send({ message: "went through" })
}

// const refreshTokenPair = async (req, res) => {
// 	const refreshToken = req.cookies["refreshToken"]

// 	try {
// 		const verifiedRefresh = verifyRefreshToken(refreshToken)

// 		const user = await User.findOneAndUpdate(
// 			{ username: verifiedRefresh["username"] },
// 			{ $inc: { refreshTokenVersion: 1 } }
// 		)

// 		if (user["refreshTokenVersion"] !== verifiedRefresh["tokenVersion"]) {
// 			return res
// 				.status(401)
// 				.send({ ok: false, message: "Refresh token invalid" })
// 		}

// 		const newRefreshToken = generateRefreshToken(
// 			verifiedRefresh["username"],
// 			user["refreshTokenVersion"] + 1
// 		)
// 		const newAccessToken = generateAccessToken(verifiedRefresh["username"])
// 		setTokens(res, newAccessToken, newRefreshToken)

// 		return res.send({ ok: true, message: "Successfully refreshed token pair!" })
// 	} catch (err) {
// 		return res.status(500).send({
// 			ok: false,
// 			message: "Problem refreshing token pair",
// 			error: err,
// 		})
// 	}
// }

module.exports = { register, login, logout, test }
