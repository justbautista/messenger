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

const generateRefreshToken = (username, tokenVersion) => {
	return jwt.sign(
		{
			username: username,
			tokenType: "refresh",
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

const checkAuth = (req, res, next) => {
    const accessToken = req.headers["authorization"]
    const refreshToken = req.cookies["refreshToken"]

    if (!accessToken && refreshToken) {
        // generate new refresh token and access token
        try {
            const verify = verifyRefreshToken(refreshToken)
            const newAccessToken = generateAccessToken(verify["username"])
            const newRefreshToken = generateRefreshToken(verify["username"])
        } catch (err) {
            // revoke refresh token

        }
        res.send({accessToken: accessToken, refreshToken: refreshToken, message: "no access token" })
    }
    else if (!refreshToken) {
        // generate make them login again
        res.send({accessToken: accessToken, refreshToken: refreshToken, message: "no refresh token" })
    }
    res.send({accessToken: req.headers["authorization"]})
    next()
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken }
