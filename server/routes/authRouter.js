const express = require("express")
const router = express.Router()
const {
	register,
	login,
	logout,
	isLoggedIn,
} = require("../controllers/authController")
const { checkAuth } = require("../helpers/authHelpers")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", checkAuth, logout)
router.post("/isLoggedIn", checkAuth, isLoggedIn)

module.exports = router
