const express = require("express")
const router = express.Router()
const { checkAuth } = require("../helpers/authHelpers")
const { searchUsers } = require("../controllers/userController")

router.get("/search", checkAuth, searchUsers)

module.exports = router

// get user, get users for searching for users to message, delete user?, update user info