import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => navigate('/user/login'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent-gradient mb-4 shadow-glow">
            <UserPlus size={32} color="white" />
          </div>
          <h2 className="text-2-0 font-800 title-gradient">Join PayOnChain</h2>
          <p className="mt-2 text-muted">Create a customer account to track your crypto payments</p>
        </div>

        <div className="glass-panel p-10">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-bg mb-4 border border-success">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h3 className="text-1-2 font-700 mb-2">Registration Successful!</h3>
              <p className="text-muted">Redirecting you to login...</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label className="input-label flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              {error && (
                <div className="p-3 rounded-sm bg-danger-bg text-danger text-0-8 border border-danger flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full py-3 text-1-1"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-muted-light text-center">
            <p className="text-muted text-0-9">
              Already have an account?{' '}
              <Link to="/user/login" className="text-accent font-600 no-underline hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-muted text-xs">
          By registering, you agree to our <Link to="/terms" className="no-underline hover:underline">Terms of Service</Link> and <Link to="/privacy" className="no-underline hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
