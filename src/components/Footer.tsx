import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-left">
          <span>CivicResolve · Powered by Google Gemini</span>
        </div>
        <div className="footer-right">
          <button onClick={() => onNavigate('home')} className="footer-link">Home</button>
          <span className="dot">·</span>
          <button onClick={() => onNavigate('report')} className="footer-link">Report Issue</button>
          <span className="dot">·</span>
          <button onClick={() => onNavigate('complaints')} className="footer-link">My Complaints</button>
          <span className="dot">·</span>
          <button onClick={() => onNavigate('admin')} className="footer-link">Admin</button>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: var(--color-footer-navy);
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .footer-left {
          display: flex;
          align-items: center;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-link {
          color: #cbd5e1;
          font-size: 0.9rem;
          transition: color 0.15s ease;
        }

        .footer-link:hover {
          color: #ffffff;
        }

        .dot {
          color: #475569;
        }

        @media (max-width: 768px) {
          .footer-container {
            height: auto;
            padding: 24px 20px;
            flex-direction: column;
            gap: 14px;
            text-align: center;
          }
          .footer-right {
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
          }
        }
      `}</style>
    </footer>
  );
};
