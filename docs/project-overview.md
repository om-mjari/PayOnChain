# PayOnChain — Project Overview

PayOnChain is a decentralized payment gateway that enables merchants to accept Ethereum and ERC-20 token payments with the ease of a traditional REST API. It combines the security of high-level cloud infrastructure (AWS) with the transparency of the Ethereum blockchain.

## 🏗️ System Architecture

The project is divided into four distinct layers:

### 1. Blockchain Layer (Ethereum Sepolia)
- **Smart Contract**: `PayOnChain.sol` handles the escrow and movement of funds.
- **Verification**: On-chain events provide immutable proof of payment.
- **Refunds**: Built-in support for cryptographically secure refunds initiated by the merchant.

### 2. Backend Layer (Node.js & Express)
- **Identity Management**: JWT-based authentication for both merchants and users.
- **API Engine**: Validates `x-api-key` requests to facilitate order creation.
- **Database**: AWS DynamoDB stores merchant profiles, orders, and transaction metadata.
- **Verification Service**: Cross-references on-chain data with database records to confirm payments.

### 3. Frontend Layer (React & Vite)
- **Merchant Dashboard**: Analytics, API key management, and transaction tracking.
- **User Portal**: A space for customers to view their payment history.
- **Hosted Payment Page**: `pay/:orderId` provides a seamless MetaMask payment experience.
- **Mobile Responsive**: Fully adaptive UI for payments on the go.

### 4. Infrastructure Layer (AWS)
- **Compute**: EC2 for backend hosting.
- **Storage**: S3 + CloudFront for frontend distribution.
- **Database**: DynamoDB for a serverless, scalable data store.

## 🔄 The Payment Lifecycle

1.  **Order Creation**: Merchant calls API with order details.
2.  **Checkout**: Customer visits the hosted payment link and confirms the transaction in MetaMask.
3.  **On-Chain confirmation**: The smart contract emits a `PaymentReceived` event.
4.  **Backend Verification**: PayOnChain backend detects the event and updates the order status to `SUCCESS`.
5.  **Webhook Notification**: The backend fires a POST request to the merchant's configured webhook URL.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Lucide-React, Ethers.js
- **Backend**: Node.js, Express, AWS SDK v3, JWT, Bcrypt
- **Blockchain**: Solidity, Hardhat, Ethers.js, Sepolia Testnet
- **Database**: AWS DynamoDB
