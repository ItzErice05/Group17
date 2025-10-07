const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');
const transactionValidator = require('../validators/transactionValidator');

class TransactionService {
    async transferMoney(transferData) {
        let session = null;
        try {
            session = await Account.startSession();
            session.startTransaction();

            const dataValidation = transactionValidator.validateTransactionData(transferData);
            if (!dataValidation.isValid) {
                throw new Error(`Validation failed: ${dataValidation.errors.join(', ')}`);
            }

            const { fromAccountId, toAccountId, amount } = transferData;

            const fromAccount = await Account.findOne({ id: fromAccountId }).session(session);
            const toAccount = await Account.findOne({ id: toAccountId }).session(session);

            if (!fromAccount) {
                throw new Error('Sender account not found');
            }

            if (!toAccount) {
                throw new Error('Recipient account not found');
            }

            if (fromAccount.balance < amount) {
                throw new Error(`Insufficient funds. Available: $${fromAccount.balance}, Required: $${amount}`);
            }

            fromAccount.balance -= amount;
            toAccount.balance += amount;

            await fromAccount.save({ session });
            await toAccount.save({ session });

            const transaction = new Transaction({
                fromAccountId,
                toAccountId,
                amount,
                timestamp: new Date()
            });

            await transaction.save({ session });

            await session.commitTransaction();

            return {
                success: true,
                transaction: transaction,
                message: `Successfully transferred $${amount} from ${fromAccountId} to ${toAccountId}`,
                newSourceBalance: fromAccount.balance,
                newDestinationBalance: toAccount.balance
            };

        } catch (error) {
            if (session) {
                await session.abortTransaction();
            }
            
            return {
                success: false,
                error: error.message
            };
        } finally {
            if (session) {
                session.endSession();
            }
        }
    }

    async getTransactionById(transactionId) {
        try {
            const transaction = await Transaction.findOne({ id: transactionId });
            
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            return {
                success: true,
                transaction: transaction
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAccountTransactions(accountId, limit = 50, page = 1) {
        try {
            const skip = (page - 1) * limit;
            
            const transactions = await Transaction.find({
                $or: [
                    { fromAccountId: accountId },
                    { toAccountId: accountId }
                ]
            })
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip);

            const total = await Transaction.countDocuments({
                $or: [
                    { fromAccountId: accountId },
                    { toAccountId: accountId }
                ]
            });

            const enrichedTransactions = transactions.map(transaction => ({
                ...transaction.toObject(),
                type: transaction.fromAccountId === accountId ? 'debit' : 'credit',
                counterparty: transaction.fromAccountId === accountId ? 
                    transaction.toAccountId : transaction.fromAccountId
            }));

            return {
                success: true,
                transactions: enrichedTransactions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getTransactionHistory(accountId1, accountId2, limit = 50) {
        try {
            const transactions = await Transaction.find({
                $or: [
                    { fromAccountId: accountId1, toAccountId: accountId2 },
                    { fromAccountId: accountId2, toAccountId: accountId1 }
                ]
            })
            .sort({ timestamp: -1 })
            .limit(limit);

            return {
                success: true,
                transactions: transactions,
                count: transactions.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getRecentTransactions(limit = 10) {
        try {
            const transactions = await Transaction.find()
                .sort({ timestamp: -1 })
                .limit(limit)
                .populate('fromAccountId', 'accountNumber accountType') 
                .populate('toAccountId', 'accountNumber accountType');

            return {
                success: true,
                transactions: transactions
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async validateTransfer(fromAccountId, toAccountId, amount) {
        try {
            const validation = await transactionValidator.validateTransactionFeasibility(
                fromAccountId, 
                toAccountId, 
                amount
            );

            if (!validation.isValid) {
                return {
                    isValid: false,
                    error: validation.error
                };
            }

            return {
                isValid: true,
                fromAccount: validation.fromAccount,
                toAccount: validation.toAccount,
                message: 'Transfer is valid and can be processed'
            };
        } catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    }
}

module.exports = new TransactionService();