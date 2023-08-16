const express = require("express")
const router = express.Router()
const {
	signUp,
	login,
	logout,
	isLoggedIn,
} = require("../controllers/authController")
const { checkAuth } = require("../helpers/authHelpers")

router.post("/signUp", signUp)
router.post("/login", login)
router.post("/logout", checkAuth, logout)
router.post("/isLoggedIn", checkAuth, isLoggedIn)

module.exports = router
