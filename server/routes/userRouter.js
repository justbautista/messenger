const express = require("express")
const router = express.Router()
const { checkAuth } = require("../helpers/authHelpers")
const { searchUsers } = require("../controllers/userController")

router.get("/search", checkAuth, searchUsers)

module.exports = router
