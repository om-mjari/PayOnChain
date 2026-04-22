import React, { useState, useEffect } from 'react';
import { User, Wallet, History, Activity, ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { merchant: user } = useAuth(); // AuthContext uses same 'merchant' key for both roles
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/users/transactions');
        setTransactions(response.data.transactions || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-1200 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="glass-panel p-6 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-gradient mb-4 border-2 border-surface-glass shadow-glow">
                <User size={40} color="white" />
              </div>
              <h2 className="text-1-2 font-800 text-primary">{user?.name || 'Customer'}</h2>
              <p className="text-xs text-muted font-mono">{user?.email}</p>
            </div>
            
            <div className="divider opacity-50"></div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted">
                <Wallet size={16} />
                <span className="text-0-8">Verified Wallet</span>
              </div>
              <div className="p-3 bg-black-20 rounded-sm border border-muted-light font-mono text-0-7 text-secondary break-all">
                {user?.walletAddress || '0x... (Connect on next payment)'}
              </div>
              <div className="flex items-center gap-3 text-muted">
                <ShieldCheck size={16} className="text-success" />
                <span className="text-0-8 text-success">Auth: MFA Active</span>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h4 className="font-600 mb-4 text-0-9">Help Center</h4>
            <ul className="list-none p-0 flex flex-col gap-3">
              <li><a href="#" className="no-underline text-muted hover-text-accent transition text-0-8">Dispute Transaction</a></li>
              <li><a href="#" className="no-underline text-muted hover-text-accent transition text-0-8">Report Merchant</a></li>
              <li><a href="#" className="no-underline text-muted hover-text-accent transition text-0-8">Security Audit</a></li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-1-5 font-800 flex items-center gap-3">
              <History size={24} className="text-accent" /> Payment History
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Globe size={14} /> Network: Sepolia Testnet
            </div>
          </div>

          <div className="glass-panel">
            {loading ? (
              <div className="p-12 text-center">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-muted">Fetching your history...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-danger">
                <p>{error}</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-16 text-center">
                <Activity size={48} className="text-muted opacity-20 mx-auto mb-6" />
                <h3 className="font-600 mb-2">No Transactions Yet</h3>
                <p className="text-muted text-0-9">Your cryptographically verified payments will appear here.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Merchant</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-center">Explorer</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.txHash || tx.orderId}>
                      <td className="font-mono text-xs">{tx.orderId}</td>
                      <td>
                        <span className="font-600">{tx.merchantName || 'Merchant'}</span>
                      </td>
                      <td className="text-muted text-0-8">
                        {new Date(tx.verifiedAt || tx.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="font-800 text-primary">{tx.amount} {tx.currency}</span>
                      </td>
                      <td>
                        <span className={`badge ${tx.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="text-center">
                        {tx.txHash ? (
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:text-accent transition"
                          >
                            <ExternalLink size={16} />
                          </a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border-muted-light bg-surface-glass">
              <h4 className="font-700 mb-2">Web3 Security Note</h4>
              <p className="text-muted text-0-8 leading-relaxed">
                Always ensure you are interacting with verified smart contracts. PayOnChain uses <strong>EIP-712</strong> for secure transaction signing.
              </p>
            </div>
            <div className="card border-muted-light bg-surface-glass">
              <h4 className="font-700 mb-2">Merchant Dispute?</h4>
              <p className="text-muted text-0-8 leading-relaxed">
                If you haven't received your product, you can request a refund through the merchant or contact our trust and safety team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
