import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, AlertCircle, CheckCircle2, History, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../services/api';

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/refunds');
      setRefunds(response.data.refunds || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        setError('Failed to load refund history');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleInitiateRefund = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await api.post('/refunds', { orderId, reason });
      setSuccessMsg(`Refund initiated for order ${orderId}. Transaction is being processed on-chain.`);
      setOrderId('');
      setReason('');
      fetchRefunds();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to initiate refund. Ensure order ID is valid and paid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.25rem' }}>Refunds</h1>
          <p className="text-secondary text-sm">Process on-chain refunds for your customers</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchRefunds}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5">
          <div className="card sticky" style={{ top: '5rem', padding: '2rem' }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ background: 'var(--accent-gradient)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                <RefreshCw size={18} color="white" />
              </div>
              <h3 style={{ fontWeight: 700 }}>New Refund</h3>
            </div>

            <p className="text-secondary text-sm mb-6 leading-relaxed">
              Refunds are processed via the PayOnChain smart contract. Funds return to the original payer.
            </p>

            <form onSubmit={handleInitiateRefund}>
              <div className="input-group">
                <label className="input-label">Order ID</label>
                <div className="relative">
                  <Search size={14} className="absolute" style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '2.25rem' }}
                    placeholder="order_7f2x9z..."
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Reason</label>
                <textarea
                  className="input-field"
                  placeholder="e.g. Customer requested refund"
                  rows="3"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>

              {error && (
                <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid #fecaca' }} className="flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {successMsg && (
                <div style={{ padding: '0.75rem', background: 'var(--success-bg)', color: '#16a34a', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }} className="flex items-center gap-2">
                  <CheckCircle2 size={14} /> Refund recorded successfully
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting} style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                {isSubmitting ? <><div className="spinner-sm"></div> Processing...</> : <>Initiate Refund <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-7">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex justify-between items-center" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-glass)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Refund History</h3>
              <span className="badge badge-secondary">{refunds.length} total</span>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-muted text-sm">Loading...</p>
              </div>
            ) : refunds.length === 0 ? (
              <div className="py-16 text-center">
                <History size={40} style={{ color: 'var(--text-muted)', opacity: 0.2, margin: '0 auto 1rem' }} />
                <p className="text-muted">No refunds yet</p>
              </div>
            ) : (
              <div>
                {refunds.map((refund, idx) => (
                  <div key={refund.refundId} style={{
                    padding: '1.25rem',
                    borderBottom: idx !== refunds.length - 1 ? '1px solid var(--border-light)' : 'none',
                    transition: 'background 0.2s'
                  }}
                  className="flex items-center justify-between"
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-glass)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{refund.orderId}</span>
                        <span className="text-xs text-muted font-mono">{refund.refundId?.substring(0,8)}</span>
                      </div>
                      <p className="text-secondary text-xs mb-1">{refund.reason || 'No reason'}</p>
                      <span className="text-xs text-muted">
                        {new Date(refund.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>-{refund.amountEth} <span className="text-sm font-400 text-muted">ETH</span></div>
                      <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>COMPLETED</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refunds;
