const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

/**
 * AWS SDK v3 DynamoDB initialization.
 * Assumes AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY exist in .env
 */
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  // In production, EC2 IAM roles are preferred over hardcoding credentials
  // but if credentials exist in .env they take precedence.
});

// The DocumentClient simplifies working with items
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

module.exports = { docClient, client };
