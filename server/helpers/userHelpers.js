const mongoose = require("mongoose")
const User = require("../models/User")

const userExists = (username) => {
    return User.exists({ username: username })
}