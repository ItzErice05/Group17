const transactionService = require('../services/transactionService');

class TransactionController {
    async transferMoney(req, res) {
        try {
            const result = await transactionService.transferMoney(req.body);
            
            if (result.success) {
                res.status(201).json({
                    success: true,
                    message: result.message,
                    data: {
                        transaction: result.transaction,
                        newSourceBalance: result.newSourceBalance,
                        newDestinationBalance: result.newDestinationBalance
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error during money transfer'
            });
        }
    }

    async validateTransfer(req, res) {
        try {
            const { fromAccountId, toAccountId, amount } = req.body;
            
            const result = await transactionService.validateTransfer(fromAccountId, toAccountId, amount);
            
            if (result.isValid) {
                res.json({
                    success: true,
                    message: result.message,
                    data: {
                        fromAccount: result.fromAccount,
                        toAccount: result.toAccount
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error during transfer validation'
            });
        }
    }

    async getTransaction(req, res) {
        try {
            const { transactionId } = req.params;
            const result = await transactionService.getTransactionById(transactionId);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.transaction
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching transaction'
            });
        }
    }

    async getAccountTransactions(req, res) {
        try {
            const { accountId } = req.params;
            const { limit = 50, page = 1 } = req.query;
            
            const result = await transactionService.getAccountTransactions(
                accountId, 
                parseInt(limit), 
                parseInt(page)
            );
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.transactions,
                    pagination: result.pagination
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching account transactions'
            });
        }
    }

    async getTransactionHistory(req, res) {
        try {
            const { accountId1, accountId2 } = req.params;
            const { limit = 50 } = req.query;
            
            const result = await transactionService.getTransactionHistory(
                accountId1,
                accountId2,
                parseInt(limit)
            );
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.transactions,
                    count: result.count
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching transaction history'
            });
        }
    }

    async getRecentTransactions(req, res) {
        try {
            const { limit = 10 } = req.query;
            
            const result = await transactionService.getRecentTransactions(parseInt(limit));
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.transactions
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching recent transactions'
            });
        }
    }

    async getTransactionStats(req, res) {
        try {
            const { accountId, period = 'month' } = req.query;
            
            res.status(501).json({
                success: false,
                error: 'Transaction statistics endpoint not implemented yet'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching transaction statistics'
            });
        }
    }
}

module.exports = new TransactionController();