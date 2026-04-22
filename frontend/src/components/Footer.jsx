import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Globe, MessageSquare, Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/pay/')) return null;
  return (
    <footer style={{ background: 'var(--bg-surface-glass)', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div style={{ background: 'var(--accent-gradient)', padding: '5px', borderRadius: '6px', display: 'flex' }}>
                <Layers size={18} color="white" />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>PayOnChain</span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed">
              Accept Ethereum payments anywhere in the world. Built with AWS and Smart Contracts.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Platform</h4>
            <ul className="list-none flex flex-col gap-2">
              <li><Link to="/about" className="no-underline text-secondary text-sm" style={{ transition: 'color 0.2s' }}>About Us</Link></li>
              <li><Link to="/merchant/register" className="no-underline text-secondary text-sm">Get Started</Link></li>
              <li><Link to="/checkout" className="no-underline text-secondary text-sm">Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Resources</h4>
            <ul className="list-none flex flex-col gap-2">
              <li><Link to="/about" className="no-underline text-secondary text-sm">Documentation</Link></li>
              <li><Link to="/about" className="no-underline text-secondary text-sm">API Reference</Link></li>
              <li><Link to="/about" className="no-underline text-secondary text-sm">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Connect</h4>
            <div className="flex gap-3 mb-4">
              <a href="https://github.com/PayOnChain" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}><Globe size={16} /></a>
              <a href="https://twitter.com/PayOnChain" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}><MessageSquare size={16} /></a>
              <a href="mailto:hello@payonchain.com" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}><Mail size={16} /></a>
            </div>
            <p className="text-muted text-xs">© 2026 PayOnChain Labs.</p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }} className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-muted text-xs">Verified on Sepolia Ethereum Network</p>
          <div className="flex gap-6">
            <Link to="/about" className="no-underline text-xs text-muted">Privacy Policy</Link>
            <Link to="/about" className="no-underline text-xs text-muted">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
