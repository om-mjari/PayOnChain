import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Layers, CheckCircle2, AlertCircle, Wallet, ShieldCheck, Lock, ArrowRight, ExternalLink, Info, ChevronRight } from 'lucide-react';
import PayOnChainABI from '../contracts/PayOnChain.json';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HostedPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API}/api/payments/order/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
    } catch (err) {
      setErrorMsg(err.message || 'Order not found');
    } finally {
      setLoadingOrder(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setErrorMsg('MetaMask is not installed. Please install it to continue.');
      return;
    }
    setStatus('connecting');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setStatus('idle');
    } catch (err) {
      setErrorMsg('Wallet connection rejected.');
      setStatus('error');
    }
  };

  const handlePayment = async () => {
    setStatus('processing');
    setErrorMsg('');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amountWei = ethers.parseEther(order.amountEth);

      // Validate contract address and merchant wallet
      const contractAddress = order.contractAddress || import.meta.env.VITE_CONTRACT_ADDRESS;
      const merchantAddress = order.merchantWalletAddress;

      if (!contractAddress) {
        throw new Error('Smart contract address is not configured. Please contact support.');
      }
      if (!merchantAddress) {
        throw new Error('Merchant wallet address is missing. Please contact support.');
      }

      const contract = new ethers.Contract(contractAddress, PayOnChainABI.abi, signer);

      const tx = await contract.pay(orderId, merchantAddress, { value: amountWei });

      setTxHash(tx.hash);
      setStatus('verifying');

      await tx.wait(1);

      const verifyRes = await fetch(`${API}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: tx.hash, orderId })
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) throw new Error(verifyData.details || verifyData.error || 'Verification failed');

      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.reason || err.message || 'Payment failed');
      setStatus('error');
    }
  };

  if (loadingOrder) {
    return (
      <div className="flex flex-col justify-center items-center" style={{ minHeight: '70vh' }}>
        <div className="spinner mb-4"></div>
        <p className="text-muted text-sm">Loading checkout...</p>
      </div>
    );
  }

  if (!order || (errorMsg && !order)) {
    return (
      <div className="flex justify-center py-20">
        <div className="card text-center" style={{ maxWidth: '480px', width: '100%', padding: '3rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--danger-bg)', marginBottom: '1.5rem' }}>
            <AlertCircle size={36} style={{ color: 'var(--danger)' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Payment Not Found</h2>
          <p className="text-secondary text-sm mb-6">{errorMsg || 'This payment link is invalid or expired.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-8">
      <div style={{ maxWidth: '960px', margin: '0 auto' }} className="flex flex-col md:flex-row gap-8">
        {/* Left: Order Info */}
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ background: 'var(--accent-gradient)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Layers size={20} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>PayOnChain</span>
          </div>

          <div className="badge badge-success mb-4" style={{ display: 'inline-flex', gap: '0.375rem' }}>
            <ShieldCheck size={12} /> {order.merchantName || 'Verified Merchant'}
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            {order.productDetails?.name || 'Payment'}
          </h1>
          <p className="text-secondary text-sm leading-relaxed mb-6">
            You are paying securely via the PayOnChain Gateway. This transaction is verified on the Ethereum network.
          </p>

          {/* Merchant Info Card */}
          <div className="card mb-8" style={{ background: 'var(--bg-surface-glass)', padding: '1rem', border: '1px solid var(--border-color)' }}>
            <div className="flex items-start gap-3">
              <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '50%', color: 'white' }}>
                <Wallet size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="text-xs text-muted font-600 uppercase mb-1">Sending to</div>
                <div className="font-600 text-sm truncate">{order.merchantName || 'Merchant'}</div>
                <div className="font-mono text-xs text-secondary mt-1 break-all bg-black-20 p-2 rounded-sm border border-muted-light">
                  {order.merchantWalletAddress || 'Address not provided'}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-secondary">Amount</span>
              <span style={{ fontWeight: 600 }}>{order.amountEth} ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-secondary">Network fee</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>~0.001 ETH</span>
            </div>
            <div className="divider" style={{ margin: '0.75rem 0' }}></div>
            <div className="flex justify-between items-center">
              <span style={{ fontWeight: 700 }}>Total</span>
              <div className="text-right">
                <div style={{ fontSize: '1.375rem', fontWeight: 800 }} className="title-gradient">{order.amountEth} ETH</div>
                <div className="text-xs text-muted">Ethereum Sepolia</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 text-xs text-muted">
            <Lock size={12} />
            <span>SSL Secured • On-Chain Verified</span>
          </div>
        </div>

        {/* Right: Payment Interaction */}
        <div style={{ flex: 1, maxWidth: '420px' }}>
          <div className="card" style={{ padding: '2rem' }}>
            {status === 'idle' && (
              <>
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Payment Method</h3>
                <div className="flex flex-col gap-3">
                  <button
                    className="btn btn-secondary btn-full btn-lg justify-between"
                    style={{ textAlign: 'left' }}
                    onClick={account ? handlePayment : connectWallet}
                  >
                    <div className="flex items-center gap-3">
                      {account ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : <Wallet size={18} style={{ color: 'var(--accent-primary)' }} />}
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{account ? 'Wallet Connected' : 'MetaMask'}</div>
                        <div className="text-xs text-muted">{account ? account.substring(0, 16) + '...' : 'Pay with ETH'}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </button>

                  <button className="btn btn-secondary btn-full btn-lg justify-between" disabled style={{ opacity: 0.5 }}>
                    <div className="flex items-center gap-3">
                      <CreditCardIcon size={18} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Card Payment</div>
                        <div className="text-xs text-muted">Coming soon</div>
                      </div>
                    </div>
                    <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>

                <button
                  className="btn btn-primary btn-full btn-lg mt-6"
                  disabled={!account}
                  onClick={handlePayment}
                  style={{ padding: '0.875rem' }}
                >
                  Pay {order.amountEth} ETH <ArrowRight size={18} />
                </button>
              </>
            )}

            {(status === 'connecting' || status === 'processing' || status === 'verifying') && (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-6" style={{ width: 40, height: 40 }}></div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                  {status === 'connecting' && 'Connecting Wallet...'}
                  {status === 'processing' && 'Awaiting Confirmation...'}
                  {status === 'verifying' && 'Verifying on Chain...'}
                </h3>
                <p className="text-secondary text-sm">
                  {status === 'processing' && 'Please confirm in MetaMask.'}
                  {status === 'verifying' && 'This usually takes 15-30 seconds.'}
                </p>
                {txHash && (
                  <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm mt-4 no-underline">
                    View on Etherscan <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-8">
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--success-bg)', marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Payment Complete!</h2>
                <p className="text-secondary text-sm mb-6">Your transaction has been confirmed on the blockchain.</p>
                <div className="card" style={{ background: 'var(--bg-surface-glass)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <span className="text-xs text-muted uppercase">Transaction Hash</span>
                  <p className="font-mono text-xs break-all mt-1">{txHash}</p>
                </div>
                <button className="btn btn-primary btn-full" onClick={() => navigate('/')}>Done</button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-8">
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'var(--danger-bg)', marginBottom: '1.5rem' }}>
                  <AlertCircle size={40} style={{ color: 'var(--danger)' }} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Transaction Failed</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--danger)' }}>{errorMsg}</p>
                <button className="btn btn-secondary btn-full" onClick={() => { setStatus('idle'); setErrorMsg(''); }}>
                  Try Again
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 items-start mt-6" style={{ padding: '1rem', background: 'var(--bg-surface-glass)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Info size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
            <p className="text-xs text-secondary leading-relaxed">
              You are paying through an audited smart contract. Always verify details in MetaMask before confirming. PayOnChain never stores your private keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreditCardIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
    <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

export default HostedPayment;
