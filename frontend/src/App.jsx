import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Transactions from './pages/Transactions';
import MerchantLogin from './pages/MerchantLogin';
import MerchantRegister from './pages/MerchantRegister';
import HostedPayment from './pages/HostedPayment';
import CreatePayment from './pages/CreatePayment';
import PaymentLinks from './pages/PaymentLinks';
import Refunds from './pages/Refunds';
import PaymentStatus from './pages/PaymentStatus';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserDashboard from './pages/UserDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main className="container" style={{ flex: '1 0 auto', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/merchant/login" element={<MerchantLogin />} />
              <Route path="/merchant/register" element={<MerchantRegister />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-payment" element={<CreatePayment />} />
              <Route path="/payment-links" element={<PaymentLinks />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/pay/:orderId" element={<HostedPayment />} />
              <Route path="/payment/status/:orderId" element={<PaymentStatus />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
