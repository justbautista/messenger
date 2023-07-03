const express = require("express")
const router = express.Router()
const {
	register,
	login,
	logout,
    test,
} = require("../controllers/authController")
const { checkAuth } = require("../helpers/authHelpers")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
// router.post("/refreshTokenPair", refreshTokenPair)
router.post("/testRoute", checkAuth, test)

module.exports = router
