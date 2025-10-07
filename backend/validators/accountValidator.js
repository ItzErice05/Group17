const Account = require('../models/Account');

const accountValidator = {
    validateAccountCreation: (accountData) => {
        const errors = [];
        
        if (!accountData.userId || accountData.userId.trim() === '') {
            errors.push('User ID is required');
        }
        
        if (!accountData.accountType || accountData.accountType.trim() === '') {
            errors.push('Account type is required');
        }
        
        if (accountData.balance !== undefined && accountData.balance < 0) {
            errors.push('Balance cannot be negative');
        }
        
        const validAccountTypes = ['checking', 'savings', 'credit'];
        if (accountData.accountType && !validAccountTypes.includes(accountData.accountType)) {
            errors.push(`Account type must be one of: ${validAccountTypes.join(', ')}`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateAccountUpdate: (updateData) => {
        const errors = [];
        
        if (updateData.balance !== undefined && updateData.balance < 0) {
            errors.push('Balance cannot be negative');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

module.exports = accountValidator;