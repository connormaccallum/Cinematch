// import express and controllers for auth routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// map register endpoint for creating new users
router.post('/register', authController.registerUser);

// map login endpoint for authenticating users
router.post('/login', authController.loginUser);

module.exports = router;