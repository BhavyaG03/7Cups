const express = require('express');
const { register, login,editUser,deleteAllUsers,getAll,getById,logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/edit/:id', editUser);
router.get('/:id', getById);
router.get('/', getAll);
router.delete('/', deleteAllUsers);
router.put("/logout", logout);


module.exports = router;
