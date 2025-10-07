const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

/**
 * @route POST /accounts
 * @description Create a new bank account
 * @access Public
 * @body {string} userId - The user ID who owns the account
 * @body {string} accountType - Type of account (checking, savings, credit)
 * @body {number} balance - Initial balance (default: 0)
 */
router.post('/', accountController.createAccount);

/**
 * @route GET /accounts/:userId
 * @description Get all accounts for a specific user
 * @access Public
 * @param {string} userId - The user ID to fetch accounts for
 */
router.get('/:userId', accountController.getUserAccounts);

module.exports = router;