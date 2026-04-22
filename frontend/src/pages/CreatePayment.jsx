import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Tag, Link as LinkIcon, Copy, CheckCircle, ArrowRight, Mail, MessageCircle, Share2 } from 'lucide-react';
import axios from 'axios';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreatePayment = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ETH',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Fetch merchant profile to get secret key for API auth
    api.get('/merchants/profile')
      .then(res => {
        setSecretKey(res.data.secretKey || '');
        setProfileLoading(false);
      })
      .catch((err) => {
        setProfileLoading(false);
        const msg = err.response?.data?.error || err.response?.data?.message || err.message;
        if (err.response?.status !== 401) {
          setError(msg || 'Failed to load merchant profile.');
        }
        // 401 is handled by api interceptor (redirects to login)
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPaymentLink('');

    if (!secretKey) {
      setError('API key not loaded. Please wait or refresh the page.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/orders`, {
        amountEth: formData.amount,
        currency: formData.currency,
        productDetails: { name: formData.description || 'Payment' }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': secretKey
        }
      });

      const { id } = response.data;
      const link = `${window.location.origin}/pay/${id}`;
      setPaymentLink(link);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="flex items-center gap-3 mb-8">
        <div style={{ background: 'var(--accent-gradient)', padding: '0.625rem', borderRadius: '10px', display: 'flex' }}>
          <ShoppingCart size={20} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800 }}>Create Payment</h1>
          <p className="text-secondary text-sm">Generate a hosted payment link for your customer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                <DollarSign size={14} /> Amount
              </label>
              <input
                type="number"
                step="0.000001"
                className="input-field"
                placeholder="0.05"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Currency</label>
              <select
                className="input-field"
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              >
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT) - Coming Soon</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                <Tag size={14} /> Description
              </label>
              <textarea
                className="input-field"
                placeholder="e.g. Premium Subscription Plan"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ padding: '0.75rem' }}>
              {loading ? <><div className="spinner-sm"></div> Creating...</> : <>Generate Payment Link <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6">
          <div className={`card flex flex-col items-center justify-center text-center transition ${paymentLink ? '' : 'opacity-50'}`} style={{ padding: '2.5rem' }}>
            <div style={{
              padding: '1.25rem', borderRadius: '50%', marginBottom: '1.25rem',
              background: paymentLink ? 'var(--success-bg)' : 'var(--bg-surface-glass)'
            }}>
              <LinkIcon size={36} style={{ color: paymentLink ? 'var(--success)' : 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Payment Link</h3>
            <p className="text-secondary text-sm mb-6">
              {paymentLink ? 'Your link is ready! Send it to your customer.' : 'Fill the form to generate a payment link.'}
            </p>

            {paymentLink && (
              <div className="w-full">
                <div className="code-block flex items-center justify-between gap-3 mb-4" style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>
                  <span className="truncate">{paymentLink}</span>
                  <button onClick={copyToClipboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', flexShrink: 0 }}>
                    {copied ? <CheckCircle size={16} style={{ color: '#22c55e' }} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex gap-3 mb-4">
                  <a href={paymentLink} target="_blank" rel="noreferrer" className="btn btn-secondary flex-1">Preview</a>
                  <button onClick={() => setPaymentLink('')} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Clear</button>
                </div>
                
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
                  <p className="text-xs text-secondary mb-3 text-left" style={{ fontWeight: 600 }}>Share via:</p>
                  <div className="flex gap-2">
                    <a 
                      href={`mailto:?subject=Payment Request&body=Please complete your payment using this link: ${paymentLink}`} 
                      className="btn btn-secondary flex-1 flex justify-center items-center" 
                      style={{ padding: '0.5rem' }}
                      title="Share via Email"
                    >
                      <Mail size={16} />
                    </a>
                    <a 
                      href={`https://wa.me/?text=Please complete your payment using this link: ${paymentLink}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-secondary flex-1 flex justify-center items-center" 
                      style={{ padding: '0.5rem', background: '#25D366', color: 'white', borderColor: '#25D366' }}
                      title="Share via WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </a>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Payment Request',
                            text: 'Please complete your payment using this link',
                            url: paymentLink,
                          }).catch(console.error);
                        } else {
                          copyToClipboard();
                        }
                      }}
                      className="btn btn-secondary flex-1 flex justify-center items-center" 
                      style={{ padding: '0.5rem' }}
                      title="More Share Options"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ background: 'var(--bg-surface-glass)' }}>
            <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pro Tip</h4>
            <p className="text-secondary text-sm leading-relaxed" style={{ fontStyle: 'italic' }}>
              You can also create orders programmatically via our REST API. Check the documentation for integration guides.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
