const express = require('express');
const router = express.Router();
const { docClient } = require('../config/dynamo');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { TRANSACTIONS_TABLE } = require('../models/schemaDocs');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * GET /api/transactions — List all merchant transactions
 * Query params: status, startDate, endDate
 */
router.get('/', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;
  const { status, startDate, endDate } = req.query;

  try {
    let filterExpression = 'merchantId = :mid';
    const expressionValues = { ':mid': merchantId };
    const expressionNames = {};

    if (status) {
      filterExpression += ' AND #st = :status';
      expressionValues[':status'] = status.toUpperCase();
      expressionNames['#st'] = 'status';
    }

    if (startDate) {
      filterExpression += ' AND verifiedAt >= :startDate';
      expressionValues[':startDate'] = startDate;
    }

    if (endDate) {
      filterExpression += ' AND verifiedAt <= :endDate';
      expressionValues[':endDate'] = endDate + 'T23:59:59.999Z';
    }

    const params = {
      TableName: TRANSACTIONS_TABLE,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionValues,
    };

    if (Object.keys(expressionNames).length > 0) {
      params.ExpressionAttributeNames = expressionNames;
    }

    const result = await docClient.send(new ScanCommand(params));

    // Sort by verifiedAt descending
    const transactions = (result.Items || []).sort((a, b) =>
      new Date(b.verifiedAt) - new Date(a.verifiedAt)
    );

    res.json({
      count: transactions.length,
      transactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * GET /api/transactions/stats — Get merchant transaction statistics
 */
router.get('/stats', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;

  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TRANSACTIONS_TABLE,
      FilterExpression: 'merchantId = :mid',
      ExpressionAttributeValues: { ':mid': merchantId }
    }));

    const transactions = result.Items || [];
    const successTx = transactions.filter(t => t.status === 'SUCCESS');
    const totalRevenue = successTx.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const successRate = transactions.length > 0
      ? ((successTx.length / transactions.length) * 100).toFixed(1)
      : 0;

    res.json({
      totalTransactions: transactions.length,
      successfulTransactions: successTx.length,
      totalRevenue: totalRevenue.toFixed(6),
      successRate: parseFloat(successRate),
      recentTransactions: transactions
        .sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt))
        .slice(0, 5)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
