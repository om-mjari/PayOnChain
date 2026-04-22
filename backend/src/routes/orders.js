const express = require('express');
const router = express.Router();
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { docClient } = require('../config/dynamo');
const { PutCommand, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { ORDERS_TABLE } = require('../models/schemaDocs');
const crypto = require('crypto');

/**
 * POST /api/orders — Create a new payment order (API key auth)
 */
router.post('/', apiKeyMiddleware, async (req, res) => {
  const { amountEth, currency, productDetails, customReference } = req.body;
  if (!amountEth) return res.status(400).json({ error: 'Missing amountEth' });

  const orderId = `order_${crypto.randomUUID()}`;

  try {
    await docClient.send(new PutCommand({
      TableName: ORDERS_TABLE,
      Item: {
        orderId,
        merchantId: req.merchant.merchantId,
        merchantWalletAddress: req.merchant.walletAddress || '',
        amountEth: String(amountEth),
        currency: currency || 'ETH',
        productDetails: productDetails || {},
        customReference: customReference || '',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    }));

    // Generate a Hosted Payment Page URL for the merchant to redirect their user to
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const hostedUrl = `${frontendUrl}/pay/${orderId}`;

    res.status(201).json({
      id: orderId,
      url: hostedUrl,
      amount: amountEth,
      merchantWalletAddress: req.merchant.walletAddress || '',
      contractAddress: process.env.CONTRACT_ADDRESS || '',
      status: 'PENDING'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

/**
 * GET /api/orders — List all merchant orders (JWT auth)
 */
router.get('/', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;
  const { status } = req.query;

  try {
    let filterExpression = 'merchantId = :mid';
    const expressionValues = { ':mid': merchantId };
    const expressionNames = {};

    if (status) {
      filterExpression += ' AND #st = :status';
      expressionValues[':status'] = status.toUpperCase();
      expressionNames['#st'] = 'status';
    }

    const params = {
      TableName: ORDERS_TABLE,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionValues,
    };

    if (Object.keys(expressionNames).length > 0) {
      params.ExpressionAttributeNames = expressionNames;
    }

    const result = await docClient.send(new ScanCommand(params));
    const orders = (result.Items || []).sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ count: orders.length, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:orderId — Get single order detail (JWT auth)
 */
router.get('/:orderId', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;

  try {
    const orderRes = await docClient.send(new GetCommand({
      TableName: ORDERS_TABLE,
      Key: { orderId: req.params.orderId }
    }));

    if (!orderRes.Item) return res.status(404).json({ error: 'Order not found' });
    if (orderRes.Item.merchantId !== merchantId) {
      return res.status(403).json({ error: 'Order does not belong to this merchant' });
    }

    res.json(orderRes.Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
