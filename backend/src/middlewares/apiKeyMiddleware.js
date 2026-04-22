const { docClient } = require('../config/dynamo');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { MERCHANTS_TABLE } = require('../models/schemaDocs');

/**
 * Validates the x-api-key header and attaches the merchantId to the request.
 */
const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) return res.status(401).json({ error: 'Missing x-api-key header' });

  try {
    // Secret key format: <merchantId>_sk_test_<randomHex>
    // Extract merchantId by finding the '_sk_test_' delimiter
    const delimiterIndex = apiKey.indexOf('_sk_test_');
    if (delimiterIndex === -1) {
      return res.status(401).json({ error: 'Invalid API Key format' });
    }

    const merchantId = apiKey.substring(0, delimiterIndex);
    if (!merchantId) return res.status(401).json({ error: 'Invalid API Key format' });

    const getRes = await docClient.send(new GetCommand({
      TableName: MERCHANTS_TABLE,
      Key: { merchantId }
    }));

    if (!getRes.Item || getRes.Item.secretKey !== apiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    req.merchant = getRes.Item;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to authenticate API Key' });
  }
};

module.exports = apiKeyMiddleware;
