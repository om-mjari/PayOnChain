/**
 * PayOnChain DynamoDB Schema Documentation
 * 
 * All table names are configurable via environment variables.
 * Create these tables in AWS DynamoDB Console or via AWS CLI.
 */

// 1. Merchants Table
// TableName: 'PayOnChain_Merchants'
// KeySchema: [ { AttributeName: 'merchantId', KeyType: 'HASH' } ]

// 2. Orders Table
// TableName: 'PayOnChain_Orders'
// KeySchema: [ { AttributeName: 'orderId', KeyType: 'HASH' } ]

// 3. Transactions Table
// TableName: 'PayOnChain_Transactions'
// KeySchema: [ { AttributeName: 'txHash', KeyType: 'HASH' } ]

// 4. Users Table (Optional user accounts)
// TableName: 'PayOnChain_Users'
// KeySchema: [ { AttributeName: 'userId', KeyType: 'HASH' } ]

// 5. Refunds Table
// TableName: 'PayOnChain_Refunds'
// KeySchema: [ { AttributeName: 'refundId', KeyType: 'HASH' } ]

module.exports = {
  MERCHANTS_TABLE: process.env.MERCHANTS_TABLE || 'PayOnChain_Merchants',
  ORDERS_TABLE: process.env.ORDERS_TABLE || 'PayOnChain_Orders',
  TRANSACTIONS_TABLE: process.env.TRANSACTIONS_TABLE || 'PayOnChain_Transactions',
  USERS_TABLE: process.env.USERS_TABLE || 'PayOnChain_Users',
  REFUNDS_TABLE: process.env.REFUNDS_TABLE || 'PayOnChain_Refunds'
};
