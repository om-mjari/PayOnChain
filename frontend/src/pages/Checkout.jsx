import React from 'react';
import { CreditCard, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  const products = [
    { id: 1, name: "Cloud Native Tier", price: "0.01 ETH", description: "Standard access to all cloud microservices." },
    { id: 2, name: "Enterprise Blockchain", price: "0.05 ETH", description: "Dedicated nodes and priority indexing." },
    { id: 3, name: "AI Health Model Pro", price: "0.10 ETH", description: "Access our advanced HexaCare predictive ecosystem." }
  ];

  const handlePurchase = (product) => {
    navigate('/payment', { state: { product } });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div className="flex items-center gap-3 mb-8">
        <Package size={28} style={{ color: 'var(--accent-primary)' }} />
        <h2>Select a Product</h2>
      </div>

      <div className="flex gap-6 justify-center flex-wrap">
        {products.map(p => (
          <div key={p.id} className="card glass-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{p.name}</h3>
            <p className="title-gradient" style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
              {p.price}
            </p>
            <p className="text-subtle mb-4" style={{ flexGrow: 1 }}>{p.description}</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handlePurchase(p)}>
              <CreditCard size={18} /> Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkout;
