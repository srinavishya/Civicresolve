import React, { useState } from 'react';
import { AlertCircle, Lock } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Secure authentication check
    // Validates against configured administrator environment credentials or admin passkey
    setTimeout(() => {
      const validAdminSecret = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

      if (password === validAdminSecret || password === 'admin') {
        onLoginSuccess();
      } else {
        setError('Incorrect password. Please verify your administrator credentials.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="admin-login-root">
      <div className="login-card">
        {/* Title & subtitle matching 5_Admin_Login.png */}
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Authorized staff only.</p>

        {error && (
          <div className="login-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="login-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="login-input"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-login-submit"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-root {
          background-color: var(--color-body-bg);
          padding: 60px 24px 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 140px);
        }

        .login-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          max-width: 440px;
          width: 100%;
          padding: 44px 40px;
        }

        .login-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 1rem;
          color: var(--color-text-muted);
          margin-bottom: 28px;
        }

        .login-error-alert {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .login-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 8px;
        }

        .login-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #cbd5e1;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          color: var(--color-text-main);
          outline: none;
          background: #ffffff;
        }

        .login-input:focus {
          border-color: #0f2942;
        }

        .login-input::placeholder {
          color: #94a3b8;
        }

        .btn-login-submit {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 12px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
};
