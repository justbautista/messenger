const jwt = require("jsonwebtoken")

const generateAccessToken = (username) => {
	return jwt.sign(
		{
			username: username,
			tokenType: "access",
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "15m",
		}
	)
}

const generateRefreshToken = (username) => {
	return jwt.sign(
		{
			username: username,
			tokenType: "refresh",
			tokenVersion: 0,
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

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken }
