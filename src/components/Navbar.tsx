import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'report', label: 'Report Issue' },
    { id: 'complaints', label: 'My Complaints' },
    { id: 'admin', label: 'Admin' }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-root">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')}>
          <div className="traffic-light-pill">
            <span className="light light-red" />
            <span className="light light-yellow" />
            <span className="light light-green" />
          </div>
          <span className="brand-name">CivicResolve</span>
        </div>

        {/* Desktop Nav Items */}
        <div className="navbar-links">
          {navItems.map((item) => {
            const isActive =
              (item.id === 'home' && currentPage === 'home') ||
              (item.id === 'report' && (currentPage === 'report' || currentPage === 'submission-result')) ||
              (item.id === 'complaints' && currentPage === 'complaints') ||
              (item.id === 'admin' && (currentPage === 'admin-login' || currentPage === 'admin-dashboard' || currentPage === 'admin'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => {
            const isActive =
              (item.id === 'home' && currentPage === 'home') ||
              (item.id === 'report' && (currentPage === 'report' || currentPage === 'submission-result')) ||
              (item.id === 'complaints' && currentPage === 'complaints') ||
              (item.id === 'admin' && (currentPage === 'admin-login' || currentPage === 'admin-dashboard' || currentPage === 'admin'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .navbar-root {
          background-color: var(--color-header-navy);
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }

        .traffic-light-pill {
          background-color: #081726;
          border-radius: 12px;
          padding: 3px 5px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
        }

        .light {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .light-red {
          background-color: #ef4444;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.8);
        }

        .light-yellow {
          background-color: #f59e0b;
          box-shadow: 0 0 6px rgba(245, 158, 11, 0.8);
        }

        .light-green {
          background-color: #10b981;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
        }

        .brand-name {
          color: #ffffff;
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          color: #e2e8f0;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 6px 0;
          position: relative;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .nav-link-active {
          color: #ffffff;
          font-weight: 700;
        }

        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--color-amber-primary);
          border-radius: 2px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-drawer {
          display: none;
          background-color: #0b1c2e;
          padding: 16px 24px;
          flex-direction: column;
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-nav-link {
          color: #cbd5e1;
          font-size: 1rem;
          font-weight: 500;
          text-align: left;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-nav-link-active {
          color: #ffffff;
          font-weight: 700;
          border-left: 4px solid var(--color-amber-primary);
          padding-left: 8px;
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 20px;
            height: 64px;
          }
          .navbar-links {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-drawer {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};
