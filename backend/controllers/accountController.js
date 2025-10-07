const accountService = require('../services/accountService');

class AccountController {
    async createAccount(req, res) {
        try {
            const result = await accountService.createAccount(req.body);
            
            if (result.success) {
                res.status(201).json({
                    success: true,
                    message: result.message,
                    data: result.account
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
                error: 'Internal server error while creating account'
            });
        }
    }

    async getAccount(req, res) {
        try {
            const { accountId } = req.params;
            const result = await accountService.getAccountById(accountId);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.account
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
                error: 'Internal server error while fetching account'
            });
        }
    }

    async getUserAccounts(req, res) {
        try {
            const { userId } = req.params;
            const result = await accountService.getAccountsByUser(userId);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.accounts,
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
                error: 'Internal server error while fetching user accounts'
            });
        }
    }

    async updateBalance(req, res) {
        try {
            const { accountId } = req.params;
            const { balance } = req.body;
            
            const result = await accountService.updateAccountBalance(accountId, balance);
            
            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    data: result.account
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
                error: 'Internal server error while updating balance'
            });
        }
    }

    async deleteAccount(req, res) {
        try {
            const { accountId } = req.params;
            const result = await accountService.deleteAccount(accountId);
            
            if (result.success) {
                res.json({
                    success: true,
                    message: result.message
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
                error: 'Internal server error while deleting account'
            });
        }
    }

    async getAccountSummary(req, res) {
        try {
            const { accountId } = req.params;
            const result = await accountService.getAccountSummary(accountId);
            
            if (result.success) {
                res.json({
                    success: true,
                    data: result.summary
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
                error: 'Internal server error while fetching account summary'
            });
        }
    }

    async getAllAccounts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            
            res.status(501).json({
                success: false,
                error: 'Get all accounts endpoint not implemented yet'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching accounts'
            });
        }
    }
}

module.exports = new AccountController();