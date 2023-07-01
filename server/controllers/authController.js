const bcrypt = require("bcrypt")
const User = require("../models/User")
const {
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} = require("../helpers/authHelpers")

const register = async (req, res) => {
	try {
		const { username, password } = req.body
		const userExists = await User.exists({ username: username })

		if (userExists) {
			return res.send("User exists")
		}

		const hash = await bcrypt.hash(password, 10)
		await User.create({ username: username, password: hash })

		const accessToken = generateAccessToken(username)
		const refreshToken = generateRefreshToken(username)

		res.cookie("refreshToken", refreshToken, { httpOnly: true })
		res.header("Authorization", `Bearer ${accessToken}`)

		return res.send({ ok: true, message: `User ${username} created!` })
	} catch (err) {
        return res.status(500).send({
            ok: false,
			error: err,
		})
	}
    // try {
    //     const v = verifyAccessToken("eJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QzIiwidG9rZW5UeXBlIjoiYWNjZXNzIiwiaWF0IjoxNjg4MTY1MjYyLCJleHAiOjE2ODgxNjYxNjJ9.cOBczBiUdDA460oc6dEKfvBj1dGeMknRK__Bdz8WvS4")
    //     res.send(v)
    // } catch (err) {
    //     res.send({ ok: false, error: err })
    // }
}

const login = (req, res) => {}

const logout = (req, res) => {}

const refreshTokens = (req, res) => {}

module.exports = { register }
