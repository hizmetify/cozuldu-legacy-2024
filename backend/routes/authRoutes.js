const express = require('express');
const { register, login, logout, me } = require('../controllers/authControllers');
const {sendEmail, EmailVerify} = require('../middlewares/sendMail');
const { PasswordSend, PasswordChange } = require('../middlewares/resetPassword');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);
router.post('/emailSend',sendEmail)
router.post('/emailVerify',EmailVerify)
router.post('/sendPass',PasswordSend)
router.post('/changePass',PasswordChange)
module.exports = router;
