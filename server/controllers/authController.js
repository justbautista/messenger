const bcrypt = require("bcrypt")
const User = require("../models/User")

const register = async (req, res) => {
	const { username, password } = req.body
    const userExists = await User.exists({ username: username})

    if (userExists) {
        return res.send("User exists")    
    }

	const hash = await bcrypt.hash(password, 10)
	const user = await User.create({ username: username, password: hash})

    res.send(user)
}

const login = (req, res) => {}

const logout = (req, res) => {}

const refreshTokens = (req, res) => {}

module.exports = { register }
