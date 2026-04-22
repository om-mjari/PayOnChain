import React, { useState, useEffect } from 'react';
import { Activity, Search, RotateCw, ExternalLink, Download, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ status: '', startDate: '', endDate: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/transactions', { params: filter });
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        setError('Failed to load transactions');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const badgeClass = (s) => {
    if (s === 'SUCCESS') return 'badge badge-success';
    if (s === 'PENDING') return 'badge badge-warning';
    return 'badge badge-danger';
  };

  const filteredTx = transactions.filter(tx =>
    tx.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.txHash && tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.25rem' }}>Transactions</h1>
          <p className="text-secondary text-sm">View your on-chain payment history</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary btn-sm" onClick={fetchTransactions}>
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="btn btn-primary btn-sm"><Download size={14} /> Export</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6" style={{ padding: '1.25rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="input-label text-xs">Search</label>
            <div className="relative">
              <Search size={14} className="absolute" style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.25rem', marginBottom: 0 }}
                placeholder="Search by Order ID or Tx Hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="input-label text-xs">Status</label>
            <select
              className="input-field"
              style={{ marginBottom: 0 }}
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
            >
              <option value="">All</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <button className="btn btn-secondary btn-full" style={{ height: '38px' }} onClick={() => setFilter({ status: '', startDate: '', endDate: '' })}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="py-16 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted text-sm">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <AlertCircle size={32} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="py-16 text-center">
            <Activity size={40} style={{ color: 'var(--text-muted)', opacity: 0.2, margin: '0 auto 1rem' }} />
            <p className="text-muted">No transactions found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tx Hash</th>
                  <th>Order ID</th>
                  <th>Amount (ETH)</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((tx) => (
                  <tr key={tx.txHash || tx.orderId}>
                    <td>
                      {tx.txHash ? (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 font-mono text-xs no-underline"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          {tx.txHash.substring(0, 14)}...
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-muted italic text-xs">Pending</span>
                      )}
                    </td>
                    <td className="font-mono text-xs">#{tx.orderId?.substring(0,12)}</td>
                    <td style={{ fontWeight: 700 }}>{tx.amount}</td>
                    <td className="text-secondary text-sm">
                      {new Date(tx.verifiedAt || tx.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td><span className={badgeClass(tx.status)}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
