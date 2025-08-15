const express = require('express');
const { register, login, editUser, deleteAllUsers, getAll, getById, logout, getUserStatus, verifyEmail, resendVerificationEmail, startSession } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/start-session', startSession);
router.put('/edit/:id', editUser);
router.get('/status/:id', getUserStatus);
router.get('/:id', getById);
router.get('/', getAll);
router.delete('/', deleteAllUsers);
router.put("/logout", logout);

module.exports = router;
