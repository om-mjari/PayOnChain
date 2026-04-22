import React, { useEffect, useState, useRef } from 'react';
import { LayoutDashboard, Eye, EyeOff, Copy, CheckCircle2, TrendingUp, DollarSign, Activity, Zap, RefreshCw, ChevronRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { merchant: authMerchant } = useAuth();
  const [merchant, setMerchant] = useState(authMerchant || null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    totalRevenue: '0.000000',
    successRate: 0,
    recentTransactions: []
  });
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, statsRes] = await Promise.all([
        api.get('/merchants/profile'),
        api.get('/transactions/stats')
      ]);
      setMerchant(profileRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      if (err.response?.status !== 401) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load dashboard data.');
      }
      // 401 is handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleRegenerateKeys = async () => {
    if (!window.confirm('Are you sure? This will invalidate your existing secret key immediately.')) return;
    setIsRegenerating(true);
    try {
      const res = await api.post('/merchants/regenerate-keys');
      setMerchant({ ...merchant, publicKey: res.data.publicKey, secretKey: res.data.secretKey });
    } catch (err) {
      console.error('Failed to regenerate keys', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading && !merchant) return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="spinner mb-4"></div>
      <p className="text-muted">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="animate-fade-in py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard</h1>
          <p className="text-secondary text-sm">Welcome back, {merchant?.companyName || 'Merchant'}</p>
        </div>
        <div className="badge badge-success flex items-center gap-2">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></div>
          Operational
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <div className="stat-value">{stats.totalRevenue || '0.00'} <span className="text-sm font-400 text-muted">ETH</span></div>
          <div className="text-xs text-success mt-2 flex items-center gap-1"><TrendingUp size={12} /> +12.5% vs last month</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Successful Orders</span>
          <div className="stat-value">{stats.successfulTransactions || 0}</div>
          <div className="text-xs text-secondary mt-2">{stats.successRate || 0}% success rate</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Volume</span>
          <div className="stat-value">{stats.totalTransactions || 0}</div>
          <div className="text-xs text-secondary mt-2">Across all payment links</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg. Transaction</span>
          <div className="stat-value">{(stats.totalRevenue / (stats.successfulTransactions || 1)).toFixed(3)} <span className="text-sm font-400 text-muted">ETH</span></div>
          <div className="text-xs text-secondary mt-2">Per successful order</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Chart */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontWeight: 700 }}>Revenue Overview</h3>
              <div className="flex gap-2">
                <button className="btn btn-secondary btn-sm">Daily</button>
                <button className="btn btn-ghost btn-sm">Weekly</button>
              </div>
            </div>
            <div className="flex items-end gap-3" style={{ height: '160px', padding: '0 0.5rem' }}>
              {[40, 65, 45, 90, 55, 80, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2" style={{ cursor: 'pointer' }}>
                  <div style={{
                    width: '100%', height: `${h}%`, borderRadius: '6px 6px 0 0',
                    background: 'var(--accent-primary)', opacity: 0.15,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.opacity = 0.6}
                  onMouseLeave={e => e.target.style.opacity = 0.15}
                  ></div>
                  <span className="text-xs text-muted">D{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ padding: 0 }}>
            <div className="flex justify-between items-center" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Recent Transactions</h3>
              <Link to="/transactions" className="btn btn-ghost btn-sm">View All <ChevronRight size={14} /></Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions?.length > 0 ? stats.recentTransactions.map(tx => (
                    <tr key={tx.orderId}>
                      <td className="font-mono text-xs">{tx.orderId?.substring(0, 16)}...</td>
                      <td style={{ fontWeight: 600 }}>{tx.amount} ETH</td>
                      <td><span className={`badge ${tx.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>{tx.status}</span></td>
                      <td className="text-muted text-xs">{new Date(tx.verifiedAt || tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted" style={{ padding: '2rem' }}>No transactions yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* API Keys */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>API Keys</h3>
              <button onClick={handleRegenerateKeys} className="btn btn-ghost btn-sm" style={{ padding: '0.375rem' }} disabled={isRegenerating}>
                <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="input-group">
              <label className="input-label text-xs">Public Key</label>
              <div className="flex gap-2">
                <input type="text" readOnly value={merchant?.publicKey || ''} className="input-field font-mono text-xs" />
                <button onClick={() => copyToClipboard(merchant?.publicKey, 'pk')} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>
                  {copied === 'pk' ? <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label text-xs">Secret Key</label>
              <div className="flex gap-2">
                <input type={showSecret ? "text" : "password"} readOnly value={merchant?.secretKey || ''} className="input-field font-mono text-xs" />
                <button onClick={() => setShowSecret(!showSecret)} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>
                  {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => copyToClipboard(merchant?.secretKey, 'sk')} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>
                  {copied === 'sk' ? <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--warning-bg)', borderRadius: '8px', border: '1px solid #fde68a', marginTop: '0.5rem' }}>
              <p className="text-xs" style={{ color: '#92400e', lineHeight: 1.5 }}>
                <strong>Important:</strong> Never expose your secret key in client-side code.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '1rem' }}>Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link to="/create-payment" className="btn btn-primary btn-full justify-start"><PlusCircle size={16} /> New Payment</Link>
              <Link to="/refunds" className="btn btn-secondary btn-full justify-start"><RefreshCw size={16} /> Process Refund</Link>
              <button onClick={fetchDashboardData} className="btn btn-ghost btn-full justify-start"><RefreshCw size={16} /> Refresh Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
