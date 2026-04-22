import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layers, LayoutDashboard, PlusCircle, Link as LinkIcon, RefreshCw, Activity, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMerchant, merchantLogout } = useAuth();

  if (location.pathname.startsWith('/pay/')) return null;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    merchantLogout();
    navigate('/merchant/login');
  };

  const navLinks = isMerchant ? [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Create Payment', path: '/create-payment', icon: <PlusCircle size={16} /> },
    { name: 'Payment Links', path: '/payment-links', icon: <LinkIcon size={16} /> },
    { name: 'Refunds', path: '/refunds', icon: <RefreshCw size={16} /> },
    { name: 'Transactions', path: '/transactions', icon: <Activity size={16} /> },
  ] : [
    { name: 'About', path: '/about', icon: null },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(11, 15, 26, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    }}>
      <div className="container">
        <div className="flex justify-between items-center" style={{ height: '64px' }}>
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div style={{ background: 'var(--accent-gradient)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Layers size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>PayOnChain</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden-mobile flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 no-underline"
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive(link.path) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: isActive(link.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden-mobile flex items-center gap-3">
            {!isMerchant ? (
              <>
                <Link to="/merchant/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/merchant/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            ) : (
              <>
                <WalletConnect />
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--danger)' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="hidden-desktop btn btn-ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ padding: '0.5rem' }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="hidden-desktop animate-fade-in" style={{ borderTop: '1px solid var(--border-color)', padding: '1rem' }}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 no-underline"
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive(link.path) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: isActive(link.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                }}
              >
                {link.icon} {link.name}
              </Link>
            ))}
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
            {!isMerchant ? (
              <>
                <Link to="/merchant/login" className="btn btn-secondary btn-full" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                <Link to="/merchant/register" className="btn btn-primary btn-full" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                <WalletConnect />
                <button onClick={handleLogout} className="btn btn-secondary btn-full" style={{ color: 'var(--danger)' }}>Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
