const express = require("express")
const router = express.Router()
const {
	register,
	login,
	logout,
	refreshTokenPair,
} = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/refreshTokenPair", refreshTokenPair)

module.exports = router
