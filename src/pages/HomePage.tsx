import React, { useEffect, useState } from 'react';
import { CitySkyline } from '../components/CitySkyline';
import { getComplaintStats } from '../services/storageService';
import { ComplaintStats } from '../types';

interface HomePageProps {
  onNavigate: (page: string, category?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Initial statistics set to zero for clean platform deployment
  const [stats, setStats] = useState<ComplaintStats>({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
    criticalOpen: 0
  });

  useEffect(() => {
    // Connect directly to live database records without mock defaults
    getComplaintStats().then((data) => {
      setStats({
        total: data.total,
        reported: data.reported,
        inProgress: data.inProgress,
        resolved: data.resolved,
        criticalOpen: data.criticalOpen
      });
    });
  }, []);

  return (
    <div className="home-page-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content-container">
          <h1 className="hero-headline">
            Report a civic issue<br />
            in under a minute
          </h1>
          <p className="hero-subtext">
            AI understands your complaint, finds the right department, and lets you<br />
            track it until it is resolved.
          </p>

          <div className="hero-cta-buttons">
            <button
              onClick={() => onNavigate('report')}
              className="btn-primary hero-btn-primary"
            >
              Report an Issue
            </button>
            <button
              onClick={() => onNavigate('complaints')}
              className="btn-secondary hero-btn-secondary"
            >
              My Complaints
            </button>
          </div>
        </div>

        {/* City skyline silhouette */}
        <CitySkyline />
      </section>

      {/* Main Content Area */}
      <section className="home-body-section">
        <div className="home-container">
          {/* Top 4 Stats Cards */}
          <div className="stats-row">
            {/* Stat 1: Total Reported */}
            <div className="stat-card stat-card-navy">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Reported</span>
            </div>

            {/* Stat 2: In Progress */}
            <div className="stat-card stat-card-blue">
              <span className="stat-number">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>

            {/* Stat 3: Resolved */}
            <div className="stat-card stat-card-green">
              <span className="stat-number">{stats.resolved}</span>
              <span className="stat-label">Resolved</span>
            </div>

            {/* Stat 4: Critical Open */}
            <div className="stat-card stat-card-red">
              <span className="stat-number">{stats.criticalOpen}</span>
              <span className="stat-label">Critical Open</span>
            </div>
          </div>

          {/* Section: How it works */}
          <div className="home-section-group">
            <h2 className="section-title">How it works</h2>
            <div className="how-it-works-grid">
              {/* Step 1 */}
              <div className="step-card">
                <div className="step-badge">1</div>
                <h3 className="step-card-title">Report</h3>
                <p className="step-card-text">
                  Describe the problem and add a photo.
                </p>
              </div>

              {/* Step 2 */}
              <div className="step-card">
                <div className="step-badge">2</div>
                <h3 className="step-card-title">AI analyses</h3>
                <p className="step-card-text">
                  Gemini finds category, priority and department.
                </p>
              </div>

              {/* Step 3 */}
              <div className="step-card">
                <div className="step-badge">3</div>
                <h3 className="step-card-title">Authority acts</h3>
                <p className="step-card-text">
                  The department reviews and updates the status.
                </p>
              </div>

              {/* Step 4 */}
              <div className="step-card">
                <div className="step-badge">4</div>
                <h3 className="step-card-title">You track</h3>
                <p className="step-card-text">
                  Follow it from Reported to Resolved.
                </p>
              </div>
            </div>
          </div>

          {/* Section: What can you report? */}
          <div className="home-section-group">
            <h2 className="section-title">What can you report?</h2>
            <div className="categories-grid">
              {/* Category 1: Potholes */}
              <div
                className="category-card"
                onClick={() => onNavigate('report', 'Potholes')}
                role="button"
                tabIndex={0}
              >
                <div className="cat-icon-wrapper">
                  {/* Pothole outline icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <ellipse cx="16" cy="16" rx="13" ry="7" stroke="#0f2942" strokeWidth="2" strokeDasharray="3 2" />
                    <ellipse cx="16" cy="16" rx="8" ry="4" stroke="#0f2942" strokeWidth="2" />
                  </svg>
                </div>
                <span className="cat-card-label">Potholes</span>
              </div>

              {/* Category 2: Garbage */}
              <div
                className="category-card"
                onClick={() => onNavigate('report', 'Garbage')}
                role="button"
                tabIndex={0}
              >
                <div className="cat-icon-wrapper">
                  {/* Garbage bin outline icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M7 10H25L23 27C23 27.5 22.5 28 22 28H10C9.5 28 9 27.5 9 27L7 10Z" stroke="#0f2942" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="5" y1="10" x2="27" y2="10" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 10V6C12 5.5 12.5 5 13 5H19C19.5 5 20 5.5 20 6V10" stroke="#0f2942" strokeWidth="2" strokeLinejoin="round" />
                    <line x1="13" y1="15" x2="13" y2="23" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" />
                    <line x1="19" y1="15" x2="19" y2="23" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="cat-card-label">Garbage</span>
              </div>

              {/* Category 3: Streetlights */}
              <div
                className="category-card"
                onClick={() => onNavigate('report', 'Streetlights')}
                role="button"
                tabIndex={0}
              >
                <div className="cat-icon-wrapper">
                  {/* Streetlight outline icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M10 28V6C10 5.5 10.5 5 11 5H21C21.5 5 22 5.5 22 6V8" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 8H23C23.5 8 24 8.5 24 9L23 13H19L18 9C18 8.5 18.5 8 19 8Z" stroke="#f59e0b" strokeWidth="2" fill="#fef3c7" />
                    <line x1="17" y1="16" x2="16" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="21" y1="16" x2="21" y2="19" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="25" y1="16" x2="26" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="cat-card-label">Streetlights</span>
              </div>

              {/* Category 4: Water Leakage */}
              <div
                className="category-card"
                onClick={() => onNavigate('report', 'Water Leakage')}
                role="button"
                tabIndex={0}
              >
                <div className="cat-icon-wrapper">
                  {/* Water drop outline icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 6C16 6 8 16 8 21C8 25.4 11.6 29 16 29C20.4 29 24 25.4 24 21C24 16 16 6 16 6Z" stroke="#0f2942" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="cat-card-label">Water Leakage</span>
              </div>

              {/* Category 5: Road Damage */}
              <div
                className="category-card"
                onClick={() => onNavigate('report', 'Road Damage')}
                role="button"
                tabIndex={0}
              >
                <div className="cat-icon-wrapper">
                  {/* Road damage outline icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <line x1="10" y1="28" x2="13" y2="4" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" />
                    <line x1="22" y1="28" x2="19" y2="4" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" />
                    <line x1="16" y1="7" x2="16" y2="12" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                    <line x1="16" y1="18" x2="16" y2="25" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                  </svg>
                </div>
                <span className="cat-card-label">Road Damage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page-root {
          width: 100%;
        }

        /* Hero */
        .hero-section {
          background-color: var(--color-hero-navy);
          color: #ffffff;
          padding: 64px 32px 0;
          text-align: left;
          position: relative;
        }

        .hero-content-container {
          max-width: 1200px;
          margin: 0 auto 56px;
        }

        .hero-headline {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }

        .hero-subtext {
          font-size: 1.15rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .hero-cta-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hero-btn-primary {
          padding: 14px 32px;
          font-size: 1.05rem;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
        }

        .hero-btn-secondary {
          padding: 14px 32px;
          font-size: 1.05rem;
        }

        /* Body Section */
        .home-body-section {
          background-color: var(--color-body-bg);
          padding: 40px 32px 72px;
        }

        .home-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 56px;
        }

        .stat-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 24px 28px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .stat-card-navy::before {
          background-color: #0f2942;
        }

        .stat-card-blue::before {
          background-color: #2563eb;
        }

        .stat-card-green::before {
          background-color: #10b981;
        }

        .stat-card-red::before {
          background-color: #ef4444;
        }

        .stat-number {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        /* Section Group */
        .home-section-group {
          margin-bottom: 56px;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }

        /* How it works */
        .how-it-works-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .step-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step-badge {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: var(--color-amber-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
        }

        .step-card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-main);
        }

        .step-card-text {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        /* Categories */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        .category-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 28px 20px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid transparent;
        }

        .category-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-card-hover);
          border-color: #e2e8f0;
        }

        .cat-icon-wrapper {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-card-label {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text-main);
          text-align: center;
        }

        @media (max-width: 1024px) {
          .stats-row, .how-it-works-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .hero-headline {
            font-size: 2.75rem;
          }
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 40px 20px 0;
          }
          .hero-headline {
            font-size: 2.1rem;
          }
          .hero-subtext {
            font-size: 1rem;
          }
          .hero-cta-buttons {
            flex-direction: column;
            width: 100%;
          }
          .hero-btn-primary, .hero-btn-secondary {
            width: 100%;
          }
          .stats-row, .how-it-works-grid, .categories-grid {
            grid-template-columns: 1fr;
          }
          .home-body-section {
            padding: 30px 16px 50px;
          }
        }
      `}</style>
    </div>
  );
};
