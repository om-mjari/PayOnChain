import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Copy, CheckCircle2, Layers, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MerchantRegister = () => {
  const [form, setForm] = useState({ email: '', password: '', companyName: '', webhookUrl: '', walletAddress: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(result.merchantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (result) {
    return (
      <div className="flex justify-center py-16">
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <div className="card text-center" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--success-bg)', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.5rem' }}>Registration Successful!</h2>
            <p className="text-secondary text-sm mb-6">Log in anytime with your email and password.</p>

            <div style={{ background: 'var(--bg-surface-glass)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Email</label>
              <div className="flex items-center justify-center gap-2">
                <code className="font-mono" style={{ fontSize: '0.875rem', wordBreak: 'break-all', color: 'var(--text-primary)' }}>{form.email}</code>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-glass)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '0.375rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Merchant ID (Backup)</label>
              <div className="flex items-center justify-center gap-2">
                <code className="font-mono" style={{ fontSize: '0.875rem', wordBreak: 'break-all', color: 'var(--text-primary)' }}>{result.merchantId}</code>
                <button onClick={copyId} className="btn btn-secondary btn-sm" style={{ flexShrink: 0, padding: '0.375rem' }}>
                  {copied ? <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={() => navigate('/merchant/login')}>
              Go to Login <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-16">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', background: 'var(--accent-gradient)', marginBottom: '1rem' }}>
            <Layers size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create your account</h1>
          <p className="text-secondary text-sm">Start accepting crypto payments in minutes</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Company Name</label>
              <input className="input-field" name="companyName" placeholder="Acme Inc." value={form.companyName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="input-field" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input-field" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Webhook URL <span className="text-muted">(optional)</span></label>
              <input className="input-field" name="webhookUrl" placeholder="https://your-server.com/webhook" value={form.webhookUrl} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Wallet Address <span className="text-muted">(optional)</span></label>
              <input className="input-field" name="walletAddress" placeholder="0x..." value={form.walletAddress} onChange={handleChange} />
              <p className="text-xs text-muted mt-1">Your Ethereum wallet address to receive on-chain payments</p>
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
              {loading ? (
                <><div className="spinner-sm"></div> Creating...</>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-secondary">
            Already registered?{' '}
            <Link to="/merchant/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegister;
