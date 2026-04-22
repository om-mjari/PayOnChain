const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { docClient } = require('../config/dynamo');
const { PutCommand, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { USERS_TABLE, TRANSACTIONS_TABLE } = require('../models/schemaDocs');

/**
 * POST /api/users/register — Register a new user
 */
router.post('/register', async (req, res) => {
  const { email, password, name, walletAddress } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields: email, password, name' });
  }

  const userId = `user_${crypto.randomUUID()}`;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await docClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        userId,
        email,
        name,
        password: hashedPassword,
        walletAddress: walletAddress || '',
        createdAt: new Date().toISOString()
      }
    }));

    res.status(201).json({
      message: 'User registered successfully',
      userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/users/login — User login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await docClient.send(new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    }));

    if (!result.Items || result.Items.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const user = result.Items[0];
    const userId = user.userId;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId, role: 'user' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '2h' }
    );

    res.json({ token, userId, user: { name: user.name, email: user.email, walletAddress: user.walletAddress }, message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/users/me — Get user profile (requires JWT with role: user)
 */
router.get('/me', async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'user') return res.status(403).json({ error: 'Access denied' });

    const getRes = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId }
    }));

    if (!getRes.Item) return res.status(404).json({ error: 'User not found' });

    delete getRes.Item.password;
    res.json(getRes.Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * GET /api/users/transactions — Get user transaction history
 * Filters transactions by walletAddress from the user profile
 */
router.get('/transactions', async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    const userRes = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId }
    }));

    if (!userRes.Item) return res.status(404).json({ error: 'User not found' });

    // Scan transactions — in production, use a GSI for better performance
    const result = await docClient.send(new ScanCommand({
      TableName: TRANSACTIONS_TABLE
    }));

    const transactions = (result.Items || [])
      .sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt));

    res.json({ count: transactions.length, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
