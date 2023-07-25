const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registerController = require("../controllers/registerController");
const { authenticateToken } = require('../middleware/authMiddleware');

router.post("/auth/login", loginController.loginUser);
router.post("/auth/register", registerController.registerNewUser);

module.exports = router;
