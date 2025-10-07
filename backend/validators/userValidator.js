const { body, validationResult } = require('express-validator');

const validateUserRegistration = [
    body('username').notEmpty().trim().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false,  message: 'Validation Failed', errors: errors.array()})
        }
        next();
    }
];

const validateUserLogin = [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation Failed', errors: errors.array() });
        }
        next();
    }
];


module.exports = {
    validateUserRegistration,
    validateUserLogin
};