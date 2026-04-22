const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { docClient } = require('../config/dynamo');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { REFUNDS_TABLE, ORDERS_TABLE, TRANSACTIONS_TABLE } = require('../models/schemaDocs');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * POST /api/refunds — Initiate a refund request
 */
router.post('/', authMiddleware, async (req, res) => {
  const { orderId, reason } = req.body;
  const merchantId = req.user.merchantId;

  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  try {
    // Verify the order belongs to this merchant
    const orderRes = await docClient.send(new GetCommand({
      TableName: ORDERS_TABLE,
      Key: { orderId }
    }));

    if (!orderRes.Item) return res.status(404).json({ error: 'Order not found' });
    if (orderRes.Item.merchantId !== merchantId) {
      return res.status(403).json({ error: 'Order does not belong to this merchant' });
    }
    if (orderRes.Item.status !== 'SUCCESS') {
      return res.status(400).json({ error: 'Can only refund successful orders' });
    }

    const refundId = `refund_${crypto.randomUUID()}`;

    await docClient.send(new PutCommand({
      TableName: REFUNDS_TABLE,
      Item: {
        refundId,
        orderId,
        merchantId,
        amountEth: orderRes.Item.amountEth,
        reason: reason || '',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }
    }));

    // Update order status to REFUND_REQUESTED
    await docClient.send(new UpdateCommand({
      TableName: ORDERS_TABLE,
      Key: { orderId },
      UpdateExpression: 'SET #st = :s',
      ExpressionAttributeValues: { ':s': 'REFUND_REQUESTED' },
      ExpressionAttributeNames: { '#st': 'status' }
    }));

    res.status(201).json({
      message: 'Refund request initiated',
      refundId,
      status: 'PENDING'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create refund request' });
  }
});

/**
 * GET /api/refunds — List all refund requests for the merchant
 */
router.get('/', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;

  try {
    const result = await docClient.send(new ScanCommand({
      TableName: REFUNDS_TABLE,
      FilterExpression: 'merchantId = :mid',
      ExpressionAttributeValues: { ':mid': merchantId }
    }));

    const refunds = (result.Items || []).sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ count: refunds.length, refunds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch refunds' });
  }
});

/**
 * PUT /api/refunds/:refundId — Update refund status
 */
router.put('/:refundId', authMiddleware, async (req, res) => {
  const { refundId } = req.params;
  const { status } = req.body;
  const merchantId = req.user.merchantId;

  const validStatuses = ['APPROVED', 'REJECTED', 'COMPLETED'];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const refundRes = await docClient.send(new GetCommand({
      TableName: REFUNDS_TABLE,
      Key: { refundId }
    }));

    if (!refundRes.Item) return res.status(404).json({ error: 'Refund not found' });
    if (refundRes.Item.merchantId !== merchantId) {
      return res.status(403).json({ error: 'Refund does not belong to this merchant' });
    }

    await docClient.send(new UpdateCommand({
      TableName: REFUNDS_TABLE,
      Key: { refundId },
      UpdateExpression: 'SET #st = :s, updatedAt = :u',
      ExpressionAttributeValues: {
        ':s': status.toUpperCase(),
        ':u': new Date().toISOString()
      },
      ExpressionAttributeNames: { '#st': 'status' }
    }));

    // If completed, update order status too
    if (status.toUpperCase() === 'COMPLETED') {
      await docClient.send(new UpdateCommand({
        TableName: ORDERS_TABLE,
        Key: { orderId: refundRes.Item.orderId },
        UpdateExpression: 'SET #st = :s',
        ExpressionAttributeValues: { ':s': 'REFUNDED' },
        ExpressionAttributeNames: { '#st': 'status' }
      }));
    }

    res.json({ message: `Refund status updated to ${status.toUpperCase()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update refund' });
  }
});

module.exports = router;
