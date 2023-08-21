const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateAccessToken = (username) => {
	return jwt.sign(
		{
			username: username,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "15m",
		}
	)
}

const generateRefreshToken = (username, tokenVersion) => {
	return jwt.sign(
		{
			username: username,
			tokenVersion: tokenVersion,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "7d",
		}
	)
}

const verifyAccessToken = (token) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

const verifyRefreshToken = (token) => {
	return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

const setTokens = (res, accessToken, refreshToken, expire = false) => {
	if (expire) {
		res.cookie("refreshToken", "", {
			httpOnly: true,
			sameSite: "Strict",
			expires: new Date(0),
		})
	} else {
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			sameSite: "Strict",
		})
		res.header("Authorization", `Bearer ${accessToken}`)
	}
}

const generateResponse = (ok, message, custom = {}) => {
	const generalResponse = {
		ok: ok,
		message: message,
	}

	const fullResponse = { ...generalResponse, ...custom }
	return fullResponse
}

const checkAuth = async (req, res, next) => {
	const accessToken = req.headers["authorization"]
	const refreshToken = req.cookies["refreshToken"]

	try {
		const verified = verifyAccessToken(accessToken.split(" ")[1])
		const user = await User.exists({ username: verified["username"] })

		if (!user) {
			return res
				.status(404)
				.send(generateResponse(false, "User not found"))
		}

		req.body["username"] = verified["username"]
		next()
	} catch (err) {
		try {
			const verifiedRefresh = verifyRefreshToken(refreshToken)

			const user = await User.findOne({
				username: verifiedRefresh["username"],
			})

			if (!user) {
				return res
					.status(404)
					.send(generateResponse(false, "User in token not found"))
			}

			if (
				user["refreshTokenVersion"] !== verifiedRefresh["tokenVersion"]
			) {
				return res
					.status(401)
					.send(generateResponse(false, "Refresh token invalid"))
			}

			const newVersion = user["refreshTokenVersion"] + 1

			const newRefreshToken = generateRefreshToken(
				verifiedRefresh["username"],
				newVersion
			)
			const newAccessToken = generateAccessToken(
				verifiedRefresh["username"]
			)
			setTokens(res, newAccessToken, newRefreshToken)
			req.body["username"] = verifiedRefresh["username"]

			await User.updateOne(
				{ username: verifiedRefresh["username"] },
				{ $set: { refreshTokenVersion: newVersion } }
			)
			next()
		} catch (err) {
			return res.status(404).send(
				generateResponse(false, "Refresh token invalid", {
					error: err,
				})
			)
		}
	}
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	setTokens,
	checkAuth,
	generateResponse,
	verifyAccessToken,
}
