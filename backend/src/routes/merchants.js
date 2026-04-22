const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { docClient } = require('../config/dynamo');
const { PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { MERCHANTS_TABLE } = require('../models/schemaDocs');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * GET /api/merchants/profile — Get full merchant profile
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const merchantId = req.user.merchantId;
    const getRes = await docClient.send(new GetCommand({
      TableName: MERCHANTS_TABLE,
      Key: { merchantId }
    }));

    if (!getRes.Item) return res.status(404).json({ error: 'Merchant not found' });

    delete getRes.Item.password;
    res.json(getRes.Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/merchants/profile — Update merchant profile
 */
router.put('/profile', authMiddleware, async (req, res) => {
  const { companyName, webhookUrl } = req.body;
  const merchantId = req.user.merchantId;

  try {
    const updateExpressions = [];
    const expressionValues = {};
    const expressionNames = {};

    if (companyName) {
      updateExpressions.push('#cn = :cn');
      expressionValues[':cn'] = companyName;
      expressionNames['#cn'] = 'companyName';
    }
    if (webhookUrl !== undefined) {
      updateExpressions.push('#wu = :wu');
      expressionValues[':wu'] = webhookUrl;
      expressionNames['#wu'] = 'webhookUrl';
    }

    if (updateExpressions.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateExpressions.push('#ua = :ua');
    expressionValues[':ua'] = new Date().toISOString();
    expressionNames['#ua'] = 'updatedAt';

    await docClient.send(new UpdateCommand({
      TableName: MERCHANTS_TABLE,
      Key: { merchantId },
      UpdateExpression: 'SET ' + updateExpressions.join(', '),
      ExpressionAttributeValues: expressionValues,
      ExpressionAttributeNames: expressionNames
    }));

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * POST /api/merchants/regenerate-keys — Regenerate API keys
 */
router.post('/regenerate-keys', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;

  try {
    const newPublicKey = `pk_test_${crypto.randomBytes(16).toString('hex')}`;
    const newSecretKey = `${merchantId}_sk_test_${crypto.randomBytes(32).toString('hex')}`;

    await docClient.send(new UpdateCommand({
      TableName: MERCHANTS_TABLE,
      Key: { merchantId },
      UpdateExpression: 'SET publicKey = :pk, secretKey = :sk, keysRegeneratedAt = :ts',
      ExpressionAttributeValues: {
        ':pk': newPublicKey,
        ':sk': newSecretKey,
        ':ts': new Date().toISOString()
      }
    }));

    res.json({
      message: 'API keys regenerated successfully',
      publicKey: newPublicKey,
      secretKey: newSecretKey
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to regenerate keys' });
  }
});

module.exports = router;
