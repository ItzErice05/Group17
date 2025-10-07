const Account = require('../models/Account');
const accountValidator = require('../validators/accountValidator');

class AccountService {
    async createAccount(accountData) {
        try {
            const validation = accountValidator.validateAccountCreation(accountData);
            if (!validation.isValid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }

            const existingAccount = await Account.findOne({ 
                userId: accountData.userId, 
                accountType: accountData.accountType 
            });

            if (existingAccount) {
                throw new Error(`User already has a ${accountData.accountType} account`);
            }

            const accountNumber = this.generateAccountNumber();

            const account = new Account({
                ...accountData,
                accountNumber: accountNumber
            });

            await account.save();
            
            return {
                success: true,
                account: account,
                message: 'Account created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAccountById(accountId) {
        try {
            const account = await Account.findOne({ id: accountId });
            
            if (!account) {
                throw new Error('Account not found');
            }

            return {
                success: true,
                account: account
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAccountsByUser(userId) {
        try {
            const accounts = await Account.find({ userId: userId });
            
            return {
                success: true,
                accounts: accounts,
                count: accounts.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateAccountBalance(accountId, newBalance) {
        try {
            if (newBalance < 0) {
                throw new Error('Balance cannot be negative');
            }

            const account = await Account.findOneAndUpdate(
                { id: accountId },
                { balance: newBalance },
                { new: true } 
            );

            if (!account) {
                throw new Error('Account not found');
            }

            return {
                success: true,
                account: account,
                message: 'Balance updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteAccount(accountId) {
        try {
            const account = await Account.findOne({ id: accountId });
            
            if (!account) {
                throw new Error('Account not found');
            }

            if (account.balance > 0) {
                throw new Error('Cannot delete account with positive balance');
            }

            await Account.findOneAndDelete({ id: accountId });

            return {
                success: true,
                message: 'Account deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAccountSummary(accountId) {
        try {
            const account = await Account.findOne({ id: accountId });
            
            if (!account) {
                throw new Error('Account not found');
            }

            const summary = {
                accountId: account.id,
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                balance: account.balance,
                formattedBalance: `$${account.balance.toFixed(2)}`,
                userId: account.userId,
                createdAt: account.createdAt
            };

            return {
                success: true,
                summary: summary
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    generateAccountNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ACC${timestamp.slice(-8)}${random}`;
    }
}

module.exports = new AccountService();