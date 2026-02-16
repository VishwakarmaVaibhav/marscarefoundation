const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePassword, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { loginValidation, registerValidation, validate } = require('../middleware/validate');

router.post('/register', protect, registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
