import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Dummy, will be replaced with real contract later

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || { name: 'Custom Payment', price: '0.001 ETH' };
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [txHash, setTxHash] = useState('');

  const handlePayment = async () => {
    setStatus('processing');
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // For demonstration, we just send ETH to a dummy address.
      // In production, we interact with CloudPay.sol
      const ethAmount = ethers.parseEther(product.price.split(' ')[0]);
      
      const tx = await signer.sendTransaction({
        to: accounts[0], // Sending to self for testing
        value: ethAmount
      });

      setTxHash(tx.hash);
      await tx.wait();

      setStatus('success');
      setTimeout(() => navigate('/transactions'), 3000);
      
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade-in flex" style={{ justifyContent: 'center', padding: '4rem 0' }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Complete Payment</h2>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-subtle">Product:</span>
            <span style={{ fontWeight: 500 }}>{product.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-subtle">Total Amount:</span>
            <span className="title-gradient" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price}</span>
          </div>
        </div>

        {status === 'idle' && (
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handlePayment}>
            Confirm & Pay via MetaMask
          </button>
        )}

        {status === 'processing' && (
          <div className="text-center" style={{ padding: '1rem' }}>
            <div className="loading-spinner" style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p>Processing transaction... Please confirm in MetaMask.</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center" style={{ padding: '1rem', color: 'var(--success)' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Payment Successful!</h3>
            <p className="text-sm" style={{ opacity: 0.8 }}>TX: {txHash.substring(0, 15)}...</p>
            <p className="text-sm mt-8">Redirecting to transactions...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center" style={{ padding: '1rem', color: 'var(--danger)' }}>
             <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
             <p>Transaction failed or rejected.</p>
             <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setStatus('idle')}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
