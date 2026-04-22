import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Wallet, LogOut } from 'lucide-react';

const WalletConnect = () => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error("Failed to connect wallet", err);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask to use CloudPay seamlessly.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  if (account) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-subtle text-sm">
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </span>
        <button className="btn btn-secondary" onClick={disconnectWallet} title="Disconnect">
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <button className="btn btn-primary" onClick={connectWallet} disabled={isConnecting}>
      <Wallet size={18} />
      {isConnecting ? "Connecting..." : "Connect MetaMask"}
    </button>
  );
};

export default WalletConnect;
