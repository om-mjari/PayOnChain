# PayOnChain — Progressive Web3 Payment Gateway

PayOnChain is a decentralized payment gateway that enables merchants to accept **Ethereum-based crypto payments** through simple REST APIs. It is built with a cloud-native architecture using **Node.js, AWS DynamoDB**, and **Ethereum Smart Contracts**.

---

## ✨ Key Features

- **Merchant Dashboard**: Comprehensive analytics, real-time revenue charts, and API key management.
- **Web3 Payments**: Secure on-chain settlements via MetaMask and Solidity smart contracts.
- **Developer First**: Familiar RESTful APIs and webhook notifications for seamless integration.
- **User Portal**: Dedicated space for customers to track their payment history across the network.
- **Refund Management**: Initiate cryptographically verified refunds directly from the dashboard.
- **Mobile Optimized**: Fully responsive interface for seamless checkout on any device.

---

## 🏗️ Technical Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│   React + Vite • Ethers.js • Tailwind-style CSS             │
│                                                             │
│  ┌─────────────┐   ┌──────────────────┐   ┌─────────────┐  │
│  │  Merchant    │   │  User Portal     │   │  Hosted     │  │
│  │  Console     │   │  (History)       │   │  Checkout   │  │
│  └──────┬──────┘   └────────┬─────────┘   └──────┬──────┘  │
└─────────┼───────────────────┼────────────────────┼─────────┘
          │                   │                    │
          ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND (API)                        │
│   Node.js • Express • AWS SDK v3 • JWT Security             │
└───────────────────────────┬─────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐   ┌─────────────────────────────┐
│       DATABASE (AWS)      │   │     BLOCKCHAIN (SEPOLIA)    │
│   DynamoDB (NoSQL)        │   │     Solidity Smart Contract │
└───────────────────────────┘   └─────────────────────────────┘
```

---

## 📁 Project Structure

```text
PayOnChain/
├── frontend/             # React.js SPA
│   ├── src/pages/        # Dashboard, Checkout, Refunds, etc.
│   ├── src/components/   # Navbar, Footer, WalletConnect
│   └── src/context/      # Auth & Global State
├── backend/              # Node.js Express API
│   ├── src/routes/       # Merchants, Orders, Transactions, Users
│   └── src/config/       # AWS/DynamoDB Configuration
├── blockchain/           # Smart Contract Suite
│   ├── contracts/        # PayOnChain.sol
│   └── test/             # Hardhat Unit Tests
└── docs/                 # Project Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS Account (Access keys for DynamoDB or use local DynamoDB)
- MetaMask Extension (Connected to Sepolia Testnet)

### 1. Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your AWS credentials, JWT secret, and blockchain settings

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with VITE_API_URL and VITE_CONTRACT_ADDRESS
```

### 2. Deploy Smart Contract (Local or Sepolia)
```bash
cd ../blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network hardhat
# Copy the deployed contract address into backend/.env and frontend/.env
```

### 3. Run the Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 Documentation

- [Project Overview](./docs/project-overview.md)
- [Deployment Guide](./docs/deployment-guide.md)
- [API Documentation](./docs/api-documentation.md)

---

## 📬 API Reference (Quick View)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register merchant |
| POST | `/api/orders` | API Key | Create payment order |
| POST | `/api/payments/verify` | None | Verify blockchain tx |
| GET | `/api/transactions/stats`| JWT | Dashboard analytics |
| POST | `/api/refunds` | JWT | Initiate on-chain refund |

---

<div align="center">
  <sub>Built with React • Express • AWS DynamoDB • Solidity • Hardhat • Ethers.js</sub>
</div>
