# PayOnChain — API Documentation

The PayOnChain API allows merchants to programmatically interact with their account and manage orders.

**Base URL**: `http://localhost:5000/api`

---

## Authentication

### Header Authentication (for Orders)
Include your Secret Key in the `x-api-key` header for order-related requests.
```text
x-api-key: sk_test_...
```

### Bearer Authentication (for Dashboard)
Include your JWT token in the `Authorization` header for dashboard and internal merchant requests.
```text
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Merchant Authentication

#### POST `/auth/register`
Register a new merchant.
- **Body**: `{ "email", "password", "companyName", "webhookUrl", "walletAddress" }`
- **Response**: `201 Created` with `{ "message", "merchantId" }`

#### POST `/auth/login`
Get a JWT token.
- **Body**: `{ "merchantId", "password" }`
- **Response**: `200 OK` with `{ "token", "message" }`

#### GET `/auth/me`
Get current merchant profile (requires JWT).
- **Response**: `200 OK` with merchant object (password omitted)

---

### 2. Orders & Payments

#### POST `/orders`
Create a new payment order. Requires `x-api-key`.
- **Body**: `{ "amountEth", "currency", "productDetails", "customReference" }`
- **Response**: `201 Created` with `{ "id", "url", "amount", "merchantWalletAddress", "contractAddress", "status" }`

#### GET `/payments/status/:orderId`
Check the status of a specific order.
- **Response**: `200 OK` with `{ "orderId", "status", "amountEth", "productDetails", "createdAt", "txHash", "verifiedAt" }`

#### GET `/payments/order/:orderId`
Get public order details for the hosted payment page.
- **Response**: `200 OK` with `{ "id", "amountEth", "productDetails", "status", "merchantWalletAddress", "contractAddress" }`

#### POST `/payments/verify`
Verify an on-chain transaction against the smart contract.
- **Body**: `{ "orderId", "txHash" }`
- **Response**: `200 OK` with `{ "message", "verified" }`

---

### 3. Merchant Dashboard (Requires JWT)

#### GET `/merchants/profile`
Retrieve full merchant profile.

#### POST `/merchants/regenerate-keys`
Rotate API keys.

---

### 4. Transactions & Refunds (Requires JWT)

#### GET `/transactions`
List all transactions. Query params: `status`, `startDate`, `endDate`.

#### GET `/transactions/stats`
Retrieve revenue and success rate analytics.

#### POST `/refunds`
Initiate a refund request.
- **Body**: `{ "orderId", "reason" }`
- **Response**: `201 Created` with `{ "message", "refundId", "status" }`

#### GET `/refunds`
List all refund requests for the merchant.
- **Response**: `200 OK` with `{ "count", "refunds" }`

#### PUT `/refunds/:refundId`
Update refund status.
- **Body**: `{ "status" }` (must be `APPROVED`, `REJECTED`, or `COMPLETED`)
- **Response**: `200 OK` with `{ "message" }`

---

## Webhook Events

When an order payment is successfully verified, PayOnChain sends a POST request to your `webhookUrl`.

**Payload Example**:
```json
{
  "event": "payment.success",
  "orderId": "order_123",
  "customReference": "...",
  "txHash": "0x...",
  "amountEth": "0.05"
}
```
Management should verify the payload using a shared secret signature (coming in Phase 2).
