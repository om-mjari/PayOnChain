import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000';

const MerchantLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { merchantLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      merchantLogin(data.token, data.merchantId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-16">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', background: 'var(--accent-gradient)', marginBottom: '1rem' }}>
            <Layers size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back</h1>
          <p className="text-secondary text-sm">Sign in to your merchant dashboard</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '1.25rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email or Merchant ID</label>
              <input className="input-field" type="text" placeholder="you@company.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
              {loading ? (
                <><div className="spinner-sm"></div> Signing in...</>
              ) : (
                <>Sign In <LogIn size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-secondary">
            Don't have an account?{' '}
            <Link to="/merchant/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantLogin;
