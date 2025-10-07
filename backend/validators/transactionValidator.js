const Account = require('../models/Account');

const transactionValidator = {
    validateTransactionData: (transactionData) => {
        const errors = [];
        
        if (!transactionData.fromAccountId || transactionData.fromAccountId.trim() === '') {
            errors.push('From Account ID is required');
        }
        
        if (!transactionData.toAccountId || transactionData.toAccountId.trim() === '') {
            errors.push('To Account ID is required');
        }
        
        if (!transactionData.amount || transactionData.amount <= 0) {
            errors.push('Amount must be greater than 0');
        }
        
        if (transactionData.fromAccountId === transactionData.toAccountId) {
            errors.push('Cannot transfer to the same account');
        }
        
        if (transactionData.amount && transactionData.amount > 1000000) { 
            errors.push('Transaction amount exceeds maximum limit');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateTransactionFeasibility: async (fromAccountId, toAccountId, amount) => {
        try {
            const fromAccount = await Account.findOne({ id: fromAccountId });
            if (!fromAccount) {
                return { isValid: false, error: 'Sender account not found' };
            }
            
            const toAccount = await Account.findOne({ id: toAccountId });
            if (!toAccount) {
                return { isValid: false, error: 'Recipient account not found' };
            }
            
            if (fromAccount.balance < amount) {
                return { 
                    isValid: false, 
                    error: `Insufficient funds. Available: $${fromAccount.balance}, Required: $${amount}` 
                };
            }
            
            return { 
                isValid: true, 
                fromAccount, 
                toAccount 
            };
        } catch (error) {
            return { isValid: false, error: 'Error validating transaction feasibility' };
        }
    }
};

module.exports = transactionValidator;