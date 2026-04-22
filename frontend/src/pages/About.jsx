import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Globe, Cpu, BarChart3 } from 'lucide-react';

const About = () => {
  return (
    <div className="animate-fade-in py-12">
      <section className="text-center mb-16">
        <div className="badge badge-success mb-4" style={{ display: 'inline-flex' }}>Built for Web3</div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', maxWidth: '700px', margin: '0 auto 1rem' }}>
          Empowering Global <span className="title-gradient">On-Chain</span> Commerce
        </h1>
        <p className="text-secondary text-lg mx-auto leading-relaxed" style={{ maxWidth: '640px' }}>
          PayOnChain is a next-generation payment gateway bridging traditional business and the decentralized economy, built with the security of Ethereum and the scalability of AWS.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Zap, title: 'Instant Settlement', desc: 'Funds settle directly to your wallet via smart contracts, bypassing traditional bank delays.' },
          { icon: Shield, title: 'Trustless Security', desc: 'All transactions verified on Ethereum blockchain, ensuring maximum transparency and safety.' },
          { icon: Globe, title: 'Global Reach', desc: 'Accept payments from anyone, anywhere in the world, with zero border restrictions.' },
        ].map((f, i) => (
          <div key={i} className="card card-interactive" style={{ padding: '2rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'rgba(79, 70, 229, 0.08)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', color: 'var(--accent-primary)'
            }}>
              <f.icon size={22} />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
            <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="card mb-16" style={{ padding: '3rem', background: 'var(--bg-surface-glass)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }} className="flex items-center gap-3">
              <Cpu size={24} style={{ color: 'var(--accent-primary)' }} /> Tech Stack
            </h2>
            <div className="flex flex-col gap-6">
              {[
                { tag: 'AWS', color: '#4f46e5', bg: 'rgba(79,70,229,0.08)', title: 'Cloud-Native Core', desc: 'Powered by AWS Lambda and DynamoDB for global sub-second response times.' },
                { tag: 'WEB3', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', title: 'Smart Contracts', desc: 'Audited Solidity contracts on Ethereum Sepolia handle secure escrow and verification.' },
                { tag: 'API', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', title: 'Developer Experience', desc: 'Stripe-style REST APIs with secure HMAC signatures. Simple to integrate.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span style={{
                    background: item.bg, color: item.color,
                    padding: '0.25rem 0.625rem', borderRadius: '6px',
                    fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'monospace',
                    height: 'fit-content', whiteSpace: 'nowrap'
                  }}>{item.tag}</span>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                    <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="card" style={{ padding: '2.5rem', background: 'white' }}>
              <BarChart3 size={100} style={{ color: 'var(--accent-primary)', opacity: 0.12, margin: '0 auto 1rem' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.375rem' }}>99.9% Uptime</h4>
              <p className="text-muted text-sm">Distributed across AWS Availability Zones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to get started?</h2>
        <div className="flex justify-center gap-4">
          <Link to="/merchant/register" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/about" className="btn btn-secondary btn-lg">View Docs</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
