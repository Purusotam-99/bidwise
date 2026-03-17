const express = require('express');
const { body } = require('express-validator');
const { register, login, digilockerVerify } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'bidder']).withMessage('Invalid role'),
    validateRequest,
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest,
  ],
  login
);

router.post(
  '/digilocker-verify',
  authMiddleware,
  [
    body('authorizationToken').notEmpty().withMessage('DigiLocker authorization token is required'),
    validateRequest,
  ],
  digilockerVerify
);

module.exports = router;
