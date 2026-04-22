# PayOnChain — Deployment Guide

This guide covers the steps required to deploy the complete PayOnChain ecosystem to AWS and the Ethereum Sepolia network.

## 1. Smart Contract Deployment (Sepolia)

1.  Navigate to `blockchain/`.
2.  Install dependencies: `npm install`.
3.  Configure `../backend/.env` with `PRIVATE_KEY` and `SEPOLIA_RPC_URL`.
4.  Compile and deploy:
    ```bash
    npx hardhat compile
    npx hardhat run scripts/deploy.js --network sepolia
    ```
5.  The deployed contract address is saved to `contract-address.json`. Copy it to:
    - `backend/.env` as `CONTRACT_ADDRESS`
    - `frontend/.env` as `VITE_CONTRACT_ADDRESS`

## 2. Backend Deployment (AWS EC2)

1.  **Launch Instance**: Use an Amazon Linux 2 or Ubuntu T2.micro instance.
2.  **Security Group**: Open ports 22 (SSH) and 5000 (API).
3.  **Install Node.js**:
    ```bash
    curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
    ```
4.  **Clone & Install**:
    ```bash
    git clone https://github.com/your-repo/PayOnChain.git
    cd PayOnChain/backend
    npm install
    ```
5.  **Environment**: Create `.env` using `.env.example` as a template and provide AWS IAM credentials + JWT secret.
6.  **Run with PM2**:
    ```bash
    sudo npm install -g pm2
    pm2 start server.js --name payonchain-api
    ```

## 3. Database Setup (AWS DynamoDB)

Ensure the following tables are created in the same region as your EC2 instance:

- `Merchants` (Partition Key: `merchantId`)
- `Orders` (Partition Key: `orderId`)
- `Transactions` (Partition Key: `txHash`)
- `Users` (Partition Key: `userId`)
- `Refunds` (Partition Key: `refundId`)

*Note: Use the environment variable table names if they differ from the defaults.*

## 4. Frontend Deployment (AWS S3 + CloudFront)

1.  Navigate to `frontend/`.
2.  Update `.env` with the backend API URL and the Contract Address.
3.  Build: `npm run build`.
4.  **S3**: Create a bucket, enable "Static Website Hosting", and upload the contents of the `dist/` folder.
5.  **CloudFront**: Create a distribution pointing to the S3 bucket's website endpoint (for better performance and SSL).

## 5. IAM Permissions

Ensure the IAM user/role used by the backend has an inline policy similar to:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/PayOnChain_*"
    }
  ]
}
```
