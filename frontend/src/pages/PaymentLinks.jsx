import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, ExternalLink, Filter, Search, RotateCw, Copy, CheckCircle } from 'lucide-react';
import api from '../services/api';

const PaymentLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setLinks(response.data.orders || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        setError('Failed to fetch payment links history');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = (orderId) => {
    const link = `${window.location.origin}/pay/${orderId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter(link =>
    link.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.25rem' }}>Payment Links</h1>
          <p className="text-secondary text-sm">Manage and track your active payment requests</p>
        </div>
        <button onClick={fetchLinks} className="btn btn-secondary btn-sm" disabled={loading}>
          <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="card mb-6" style={{ padding: '1rem' }}>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1" style={{ minWidth: '250px' }}>
            <Search size={16} className="absolute" style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.25rem', marginBottom: 0 }}
              placeholder="Search by Order ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/create-payment" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>+ Create New</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem' }} className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted text-sm">Loading your links...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '3rem' }} className="text-center">
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div style={{ padding: '3rem' }} className="text-center">
            <LinkIcon size={40} style={{ color: 'var(--text-muted)', opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>No links found</h3>
            <p className="text-muted text-sm mb-4">You haven't created any payment links yet.</p>
            <Link to="/create-payment" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Create First Link</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID / Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => (
                  <tr key={link.orderId}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{link.orderId}</div>
                      <div className="text-xs text-muted">{new Date(link.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <div className="text-sm truncate" style={{ maxWidth: '200px' }} title={link.description}>
                        {link.description || 'No description'}
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 700 }}>{link.amount} {link.currency}</span></td>
                    <td>
                      <span className={`badge ${
                        link.status === 'PAID' ? 'badge-success' :
                        link.status === 'PENDING' ? 'badge-warning' :
                        'badge-danger'
                      }`}>{link.status}</span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleCopy(link.orderId)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.375rem' }}
                          title="Copy Link"
                        >
                          {copiedId === link.orderId ? <CheckCircle size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                        </button>
                        <a
                          href={`/pay/${link.orderId}`}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.375rem' }}
                          title="View Page"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
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


export default PaymentLinks;
