import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', { email, password });
      login(response.data.token, { role: 'user', ...response.data.user });
      navigate('/user/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent-gradient mb-4 shadow-glow">
            <ShieldCheck size={32} color="white" />
          </div>
          <h2 className="text-2-0 font-800 title-gradient">User Portal</h2>
          <p className="mt-2 text-muted">Track your blockchain payments and wallet history</p>
        </div>

        <div className="glass-panel p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-sm bg-danger-bg text-danger text-0-8 border border-danger flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full py-3 text-1-1"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-muted-light text-center">
            <p className="text-muted text-0-9">
              Don't have a user account?{' '}
              <Link to="/user/register" className="text-accent font-600 no-underline hover:underline">
                Register here
              </Link>
            </p>
            <div className="mt-4">
              <Link to="/merchant/login" className="text-xs text-muted hover-text-accent no-underline">
                Merchant? Go to Merchant Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
