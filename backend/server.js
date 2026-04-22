require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const ordersRoutes = require('./src/routes/orders');
const paymentsRoutes = require('./src/routes/payments');
const merchantsRoutes = require('./src/routes/merchants');
const transactionsRoutes = require('./src/routes/transactions');
const refundsRoutes = require('./src/routes/refunds');
const usersRoutes = require('./src/routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// Main health/architecture check route
app.get('/', (req, res) => {
  res.json({ status: 'PayOnChain Gateway Active', version: '1.0.0' });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/merchants', merchantsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/refunds', refundsRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PayOnChain server running on port ${PORT}`);
});