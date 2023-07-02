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

const login = async (req, res) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username: username })

		if (!user) {
			return res.send("User does not exist")
		}

		const isValid = await bcrypt.compare(password, user["password"])

		if (!isValid) {
			return res.send("Wrong password")
		}

		const accessToken = generateAccessToken(username)
		const refreshToken = generateRefreshToken(username)

		res.cookie("refreshToken", refreshToken, { httpOnly: true })
		res.header("Authorization", `Bearer ${accessToken}`)
		return res.send({ ok: true, message: `User ${username} logged in!` })
	} catch (err) {
		return res.send({ ok: false, error: err.message })
	}
}

const logout = async (req, res) => {
	try {
		const { username } = req.body
		const user = await User.findOneAndUpdate(
			{ username: username },
			{ $inc: { refreshTokenVersion: 1 } }
		)

		res.cookie("refreshToken", "", { httpOnly: true })
		return res.send(`Successfully logged ${user.username} out!`)
	} catch (err) {
		return res.send({ ok: false, error: err.message })
	}
}

module.exports = { register, login, logout }
