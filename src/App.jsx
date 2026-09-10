import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import Toast from './components/Toast';
import { getCurrentUser, logoutUser } from './utils/storage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('login'); // 'login' | 'register' | 'home'
  const [prefillEmail, setPrefillEmail] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // On mount, restore session from localStorage if present
  useEffect(() => {
    const session = getCurrentUser();
    if (session) {
      setCurrentUser(session);
      setActiveView('home');
    }
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev.message === message ? { message: '', type: 'info' } : prev));
    }, 3500);
  };

  const handleNavigate = (view, extraProps = {}) => {
    if (view === 'home' && !currentUser) {
      showToast('Please sign in to access the home page.', 'error');
      setActiveView('login');
      return;
    }
    if (extraProps.prefillEmail) {
      setPrefillEmail(extraProps.prefillEmail);
    }
    setActiveView(view);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveView('home');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveView('login');
    showToast('Logged out successfully.', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {activeView === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
            showToast={showToast}
            initialEmail={prefillEmail}
          />
        )}

        {activeView === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        )}

        {activeView === 'home' && currentUser && (
          <HomePage
            currentUser={currentUser}
            showToast={showToast}
          />
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}
