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
			expiresIn: "1h",
		}
	)
}

const verifyAccessToken = (token) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

const verifyRefreshToken = (token) => {
	return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

const setTokens = (res, accessToken, refreshToken) => {
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
	})
	res.header("Authorization", `Bearer ${accessToken}`)
}

const checkAuth = async (req, res, next) => {
	const accessToken = req.headers["authorization"]
	const refreshToken = req.cookies["refreshToken"]

	try {
		verifyAccessToken(accessToken.split(" ")[1])
		// res.send({ ok: true, message: "Access token verified" })
		next()
	} catch (err) {
		try {
			const verifiedRefresh = verifyRefreshToken(refreshToken)

			const user = await User.findOneAndUpdate(
				{ username: verifiedRefresh["username"] },
				{ $inc: { refreshTokenVersion: 1 } }
			)

			if (user["refreshTokenVersion"] !== verifiedRefresh["tokenVersion"]) {
				return res
					.status(401)
					.send({ ok: false, message: "Refresh token invalid" })
			}

			const newRefreshToken = generateRefreshToken(
				verifiedRefresh["username"],
				user["refreshTokenVersion"] + 1
			)
			const newAccessToken = generateAccessToken(
				verifiedRefresh["username"]
			)
			setTokens(res, newAccessToken, newRefreshToken)

			// res.send({ ok: true, message: "Successfully refreshed token pair!" })
			next()
		} catch (err) {
			return res.status(404).send({
				ok: false,
				message: "Refresh token invalid",
				error: err,
			})
		}
	}
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	setTokens,
	checkAuth,
}
