const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { docClient } = require('../config/dynamo');
const { PutCommand, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { MERCHANTS_TABLE } = require('../models/schemaDocs');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', async (req, res) => {
  const { email, password, companyName, webhookUrl, walletAddress } = req.body;
  if (!email || !password || !companyName) return res.status(400).json({ error: 'Missing required fields' });

  const merchantId = crypto.randomUUID();

  try {
    // Basic dup-check normally requires GSI in Dynamo, assuming non-colliding IDs for demo ease
    const hashedPassword = await bcrypt.hash(password, 10);
    const publicKey = `pk_test_${crypto.randomBytes(16).toString('hex')}`;
    const secretKey = `${merchantId}_sk_test_${crypto.randomBytes(32).toString('hex')}`;

    await docClient.send(new PutCommand({
      TableName: MERCHANTS_TABLE,
      Item: {
        merchantId,
        email,
        companyName,
        password: hashedPassword,
        webhookUrl: webhookUrl || '',
        walletAddress: walletAddress || '',
        publicKey,
        secretKey,
        createdAt: new Date().toISOString()
      }
    }));

    res.status(201).json({ message: 'Merchant registered successfully', merchantId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'Identifier and password are required' });

  try {
    let merchant;

    if (identifier.includes('@')) {
      // Email login — scan table for matching email
      const scanRes = await docClient.send(new ScanCommand({
        TableName: MERCHANTS_TABLE,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': identifier }
      }));

      if (!scanRes.Items || scanRes.Items.length === 0) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      merchant = scanRes.Items[0];
    } else {
      // Merchant ID login — direct partition key lookup
      const getRes = await docClient.send(new GetCommand({
        TableName: MERCHANTS_TABLE,
        Key: { merchantId: identifier }
      }));

      if (!getRes.Item) return res.status(400).json({ error: 'Invalid credentials' });
      merchant = getRes.Item;
    }

    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ merchantId: merchant.merchantId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    res.json({ token, merchantId: merchant.merchantId, message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;
  const getRes = await docClient.send(new GetCommand({
      TableName: MERCHANTS_TABLE,
      Key: { merchantId }
  }));
  if (!getRes.Item) return res.status(404).json({ error: 'Not found' });
  
  delete getRes.Item.password; // Omit password hash
  res.json(getRes.Item);
});

module.exports = router;
