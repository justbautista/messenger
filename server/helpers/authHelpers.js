const jwt = require("jsonwebtoken")

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
	res.cookie("refreshToken", refreshToken, { httpOnly: true, path: "/v1/auth/refreshTokenPair" })
	res.header("Authorization", `Bearer ${accessToken}`)
}

const checkAuth = (req, res, next) => {
	const accessToken = req.headers["authorization"]
    

	next()
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	setTokens,
}
