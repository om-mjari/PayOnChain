import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [merchantToken, setMerchantToken] = useState(localStorage.getItem('poc_token'));
  const [merchantId, setMerchantId] = useState(localStorage.getItem('poc_merchantId'));
  const [userToken, setUserToken] = useState(localStorage.getItem('poc_user_token'));
  const [userId, setUserId] = useState(localStorage.getItem('poc_userId'));

  const isMerchant = !!merchantToken;
  const isUser = !!userToken;
  const isAuthenticated = isMerchant || isUser;

  const merchantLogin = (token, id) => {
    localStorage.setItem('poc_token', token);
    localStorage.setItem('poc_merchantId', id);
    setMerchantToken(token);
    setMerchantId(id);
  };

  const merchantLogout = () => {
    localStorage.removeItem('poc_token');
    localStorage.removeItem('poc_merchantId');
    setMerchantToken(null);
    setMerchantId(null);
  };

  const userLogin = (token, id) => {
    localStorage.setItem('poc_user_token', token);
    localStorage.setItem('poc_userId', id);
    setUserToken(token);
    setUserId(id);
  };

  const userLogout = () => {
    localStorage.removeItem('poc_user_token');
    localStorage.removeItem('poc_userId');
    setUserToken(null);
    setUserId(null);
  };

  // Listen for storage changes (e.g., logout in another tab)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'poc_token') setMerchantToken(e.newValue);
      if (e.key === 'poc_merchantId') setMerchantId(e.newValue);
      if (e.key === 'poc_user_token') setUserToken(e.newValue);
      if (e.key === 'poc_userId') setUserId(e.newValue);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = {
    merchantToken,
    merchantId,
    userToken,
    userId,
    isMerchant,
    isUser,
    isAuthenticated,
    merchantLogin,
    merchantLogout,
    userLogin,
    userLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
