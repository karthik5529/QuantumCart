import React from 'react';
import { API_BASE_URL } from '../config';
const LoginPage = () => {
  const handleLogin = () => {
    // Redirect to the backend login route
window.location.href = `${API_BASE_URL}/login`;
 };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1 className="login-title">QuantumCart</h1>
        <p className="login-subtitle">Your Ultimate Shopping Destination</p>
        <button onClick={handleLogin} className="google-signin-button">
          <svg className="google-icon" width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9.1818v3.4818h4.7909c-.2045 1.125-.8227 2.0782-1.7773 2.7227v2.2591h2.9091c1.7045-1.5682 2.6864-3.8727 2.6864-6.6227z" fill="#4285F4"></path><path d="M9.1818 18c2.4455 0 4.4955-.8091 5.9955-2.1818l-2.9091-2.2591c-.8091.5455-1.8409.8727-3.0864.8727-2.3545 0-4.3636-1.5864-5.0818-3.7182H1.0909v2.3318C2.5909 16.2227 5.6318 18 9.1818 18z" fill="#34A853"></path><path d="M4.1 10.7182c-.1136-.3409-.1773-.7045-.1773-1.0773s.0636-.7364.1773-1.0773V6.2318H1.0909C.3818 7.6636 0 9.2773 0 11.0045s.3818 3.3409 1.0909 4.7727L4.1 13.0455v-2.3273z" fill="#FBBC05"></path><path d="M9.1818 3.5455c1.3364 0 2.5273.4636 3.4727 1.3727l2.5864-2.5864C13.6727.9545 11.6227 0 9.1818 0 5.6318 0 2.5909 1.7773 1.0909 4.1091l3.0091 2.3318c.7182-2.1318 2.7273-3.7182 5.0818-3.7182z" fill="#EA4335"></path></g></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
