import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ExternalLink, ArrowLeft, Home } from 'lucide-react';
import api from '../services/api';

const PaymentStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get(`/payments/status/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        console.error(err);
        setError('Could not retrieve payment status. Please check the Order ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Poll every 10 seconds if pending
    const interval = setInterval(() => {
      if (order && order.status === 'PENDING') {
        fetchStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="spinner mb-4"></div>
        <p className="text-muted">Loading payment status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-600 mx-auto text-center py-12">
        <XCircle size={64} className="text-danger mx-auto mb-6" />
        <h1 className="text-1-5 font-800 mb-4">Verification Error</h1>
        <p className="text-muted mb-8">{error}</p>
        <Link to="/" className="btn btn-secondary">
          <Home size={18} /> Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-600 mx-auto py-8">
      <div className="glass-panel p-10 text-center animate-fade-in">
        {order.status === 'SUCCESS' || order.status === 'PAID' ? (
          <>
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-bg border border-success">
              <CheckCircle2 size={42} className="text-success" />
            </div>
            <h1 className="text-2-0 font-800 mb-2">Payment Successful!</h1>
            <p className="text-secondary mb-8">Your transaction has been verified on the blockchain.</p>
          </>
        ) : order.status === 'PENDING' ? (
          <>
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning-bg border border-warning">
              <Clock size={42} className="text-warning animate-pulse" />
            </div>
            <h1 className="text-2-0 font-800 mb-2">Payment Pending</h1>
            <p className="text-secondary mb-8">We are waiting for blockchain confirmations. This usually takes 10-60 seconds.</p>
          </>
        ) : (
          <>
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-danger-bg border border-danger">
              <XCircle size={42} className="text-danger" />
            </div>
            <h1 className="text-2-0 font-800 mb-2">Payment Failed</h1>
            <p className="text-secondary mb-8">Something went wrong with your payment or verification.</p>
          </>
        )}

        <div className="card text-left bg-surface mb-8">
          <div className="p-4 border-b border-muted-light flex justify-between items-center">
            <span className="text-muted text-0-8 font-600">ORDER DETAILS</span>
            <span className="font-mono text-0-8 text-secondary">{order.orderId}</span>
          </div>
          <div className="p-6">
            <div className="flex justify-between mb-3">
              <span className="text-muted">Amount</span>
              <span className="font-700 text-1-1">{order.amount} {order.currency}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-muted">Product</span>
              <span className="text-secondary">{order.description || 'Service/Product'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Network</span>
              <span className="text-secondary">Ethereum Sepolia</span>
            </div>
          </div>
          {order.txHash && (
            <div className="p-4 bg-black-20 flex justify-between items-center border-t border-muted-light">
              <span className="text-muted text-0-8">Transaction Hash</span>
              <a 
                href={`https://sepolia.etherscan.io/tx/${order.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-accent flex items-center gap-1 text-0-8 font-600 no-underline hover:underline"
              >
                View on Etherscan <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {order.redirectUrl && (
            <button 
              onClick={() => window.location.href = order.redirectUrl}
              className="btn btn-primary btn-full py-4 text-1-1"
            >
              Back to Merchant
            </button>
          )}
          <Link to="/" className="btn btn-secondary flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Back to PayOnChain
          </Link>
        </div>
      </div>
      
      <p className="text-center text-muted text-xs mt-8">
        Secure payment processed by PayOnChain Gateway. <br />
        Encryption: SHA-256 • Verified: Web3/Ethereum
      </p>
    </div>
  );
};

export default PaymentStatus;
