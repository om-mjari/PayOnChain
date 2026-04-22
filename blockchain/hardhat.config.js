require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: '../backend/.env' });

// Validate private key length (64 hex chars + optional 0x prefix)
const privateKey = process.env.PRIVATE_KEY;
const isValidKey = privateKey && privateKey.startsWith('0x') && privateKey.length === 66;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.24" },
      { version: "0.8.28" }
    ]
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: isValidKey ? [privateKey] : []
    }
  },
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test"
  }
};
