const express = require('express');
const { register, login,editUser,deleteAllUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/edit/:id', editUser);
router.delete('/delete', deleteAllUsers);

module.exports = router;
