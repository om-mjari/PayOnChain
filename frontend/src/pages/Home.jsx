import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Webhook, Key, CreditCard, ChevronRight, ArrowRight, Lock, Code, CheckCircle2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '4rem 0 3rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="badge badge-success mb-4" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              <CheckCircle2 size={12} /> Live on Ethereum Sepolia
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Accept Crypto Payments <span className="title-gradient">Easily</span>
            </h1>
            <p className="text-secondary text-lg leading-relaxed mb-8" style={{ maxWidth: '480px' }}>
              A modern payment gateway for Web3. Accept Ethereum payments with simple APIs, instant settlements, and a beautiful hosted checkout.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/merchant/register" className="btn btn-primary btn-lg">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                View Documentation
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Lock size={14} /> End-to-end encrypted
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Shield size={14} /> On-chain verified
              </div>
            </div>
          </div>

          {/* Code Preview Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex items-center gap-2" style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-glass)', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }}></div>
              <span className="text-xs text-muted ml-2 font-mono">POST /api/orders</span>
            </div>
            <div className="code-block" style={{ borderRadius: 0, margin: 0 }}>
              <span style={{ color: '#818cf8' }}>curl</span>{' -X POST https://api.payonchain.com/v1/orders \\'}<br/>
              {'  -H '}<span style={{ color: '#34d399' }}>{'"x-api-key: pk_live_..."'}</span>{' \\'}<br/>
              {'  -d '}<span style={{ color: '#fbbf24' }}>{`'{"amount": "0.5", "currency": "ETH"}'`}</span>
              <br/><br/>
              <span style={{ color: '#64748b' }}>{'// Response'}</span><br/>
              <span style={{ color: '#94a3b8' }}>{'{'}</span><br/>
              {'  "id": '}<span style={{ color: '#fbbf24' }}>{'"ord_7f2x3..."'}</span>,<br/>
              {'  "url": '}<span style={{ color: '#fbbf24' }}>{'"https://payonchain.com/pay/ord_7f2x3"'}</span><br/>
              <span style={{ color: '#94a3b8' }}>{'}'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="text-center mb-12">
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Everything you need to accept crypto
          </h2>
          <p className="text-secondary text-lg mx-auto" style={{ maxWidth: '560px' }}>
            Built for developers, designed for businesses. PayOnChain handles payments so you can focus on your product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Instant Settlement', desc: 'Funds are settled directly to your wallet via smart contracts. No banks, no delays.' },
            { icon: Shield, title: 'Trustless Security', desc: 'Every transaction is verified on the Ethereum blockchain for maximum transparency.' },
            { icon: Globe, title: 'Global Payments', desc: 'Accept payments from anyone, anywhere. Zero border restrictions, zero FX fees.' },
            { icon: Key, title: 'API Key Auth', desc: 'Familiar REST APIs with secure API key authentication. Integrate in minutes.' },
            { icon: Webhook, title: 'Webhooks', desc: 'Get real-time notifications when payments are confirmed on-chain.' },
            { icon: CreditCard, title: 'Hosted Checkout', desc: 'Beautiful, branded checkout pages that your customers trust and love.' },
          ].map((f, i) => (
            <div key={i} className="card card-interactive" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(79, 70, 229, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem', color: 'var(--accent-primary)'
              }}>
                <f.icon size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="card" style={{ padding: '3rem', background: 'var(--bg-surface-glass)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                Simple integration, powerful results
              </h2>
              <p className="text-secondary leading-relaxed mb-6">
                PayOnChain provides everything you need: REST APIs for creating orders, a hosted checkout page for your customers, and a real-time dashboard to manage your business.
              </p>
              <div className="flex flex-col gap-4">
                {['Create an order via API', 'Redirect customer to hosted checkout', 'Payment verified on-chain automatically'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'var(--accent-primary)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                    }}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-500">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/about" className="btn btn-secondary">
                  Learn More <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="card" style={{ padding: '2rem', background: 'white' }}>
                <Code size={80} style={{ color: 'var(--accent-primary)', opacity: 0.15, margin: '0 auto 1rem' }} />
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Developer Friendly</h4>
                <p className="text-muted text-sm">REST API • Webhooks • SDKs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to accept crypto payments?
        </h2>
        <p className="text-secondary mb-8 mx-auto" style={{ maxWidth: '480px' }}>
          Join merchants worldwide using PayOnChain to accept Ethereum payments with zero hassle.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/merchant/register" className="btn btn-primary btn-lg">Start for Free</Link>
          <Link to="/about" className="btn btn-secondary btn-lg">Learn More</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
