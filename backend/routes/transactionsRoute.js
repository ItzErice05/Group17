const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

/**
 * @route POST /transfer
 * @description Transfer money between two accounts
 * @access Public
 * @body {string} fromAccountId - Source account ID
 * @body {string} toAccountId - Destination account ID
 * @body {number} amount - Amount to transfer
 */
router.post('/transfer', transactionController.transferMoney);

/**
 * @route GET /transactions/:accountId
 * @description Get all transactions for a specific account
 * @access Public
 * @param {string} accountId - The account ID to fetch transactions for
 * @query {number} [limit=50] - Number of transactions to return
 * @query {number} [page=1] - Page number for pagination
 */
router.get('/:accountId', transactionController.getAccountTransactions);

module.exports = router;