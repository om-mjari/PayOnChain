require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });

const tables = [
  {
    TableName: process.env.MERCHANTS_TABLE || 'PayOnChain_Merchants',
    KeySchema: [{ AttributeName: 'merchantId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'merchantId', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: process.env.ORDERS_TABLE || 'PayOnChain_Orders',
    KeySchema: [{ AttributeName: 'orderId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'orderId', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: process.env.TRANSACTIONS_TABLE || 'PayOnChain_Transactions',
    KeySchema: [{ AttributeName: 'txHash', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'txHash', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: process.env.USERS_TABLE || 'PayOnChain_Users',
    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'userId', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: process.env.REFUNDS_TABLE || 'PayOnChain_Refunds',
    KeySchema: [{ AttributeName: 'refundId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'refundId', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  }
];

async function setup() {
  for (const table of tables) {
    try {
      await client.send(new CreateTableCommand(table));
      console.log(`Created table: ${table.TableName}`);
    } catch (err) {
      if (err.name === 'ResourceInUseException') {
        console.log(`Table already exists: ${table.TableName}`);
      } else {
        console.error(`Failed to create ${table.TableName}:`, err.message);
      }
    }
  }
  console.log('Setup complete.');
}

setup();
