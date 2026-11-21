import React, { useEffect, useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';
import { TrackingTimeline } from '../components/TrackingTimeline';
import { getAllComplaints, searchComplaints } from '../services/storageService';

interface MyComplaintsPageProps {
  selectedComplaintId?: string;
  onNavigate: (page: string) => void;
}

export const MyComplaintsPage: React.FC<MyComplaintsPageProps> = ({
  selectedComplaintId
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | ComplaintStatus>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [, setLoading] = useState(true);

  // Load complaints
  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    const list = await getAllComplaints();
    setComplaints(list);

    // Pick complaint to show tracking for
    if (selectedComplaintId) {
      const match = list.find(c => c.id.toUpperCase() === selectedComplaintId.toUpperCase());
      if (match) {
        setSelectedComplaint(match);
      } else {
        setSelectedComplaint(list[0] || null);
      }
    } else if (list.length > 0) {
      setSelectedComplaint(list[0]);
    } else {
      setSelectedComplaint(null);
    }
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await loadComplaints();
      return;
    }
    setLoading(true);
    const results = await searchComplaints(searchQuery);
    setComplaints(results);
    if (results.length > 0) {
      setSelectedComplaint(results[0]);
    } else {
      setSelectedComplaint(null);
    }
    setLoading(false);
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (activeFilter === 'All') return true;
    return c.status === activeFilter;
  });

  // Count per status
  const countAll = complaints.length;
  const countReported = complaints.filter(c => c.status === 'Reported').length;
  const countInProgress = complaints.filter(c => c.status === 'In Progress').length;
  const countResolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="my-complaints-root">
      <div className="complaints-container">
        {/* Header matching 4_My_Complaints.png */}
        <div className="page-header">
          <h1 className="page-title">My Complaints</h1>
          <p className="page-subtitle">
            Complaints registered from this device, or found with your phone number or email.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form-row">
          <input
            type="text"
            className="search-input"
            placeholder="Enter Complaint ID, phone or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        {/* Filter Pills matching 4_My_Complaints.png */}
        <div className="filter-pills-row">
          <button
            type="button"
            onClick={() => setActiveFilter('All')}
            className={`filter-pill ${activeFilter === 'All' ? 'filter-pill-active' : ''}`}
          >
            All ({countAll})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('Reported')}
            className={`filter-pill ${activeFilter === 'Reported' ? 'filter-pill-active' : ''}`}
          >
            Reported ({countReported})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('In Progress')}
            className={`filter-pill ${activeFilter === 'In Progress' ? 'filter-pill-active' : ''}`}
          >
            In Progress ({countInProgress})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('Resolved')}
            className={`filter-pill ${activeFilter === 'Resolved' ? 'filter-pill-active' : ''}`}
          >
            Resolved ({countResolved})
          </button>
        </div>

        {/* Complaints List */}
        <div className="complaints-list-section">
          {filteredComplaints.length === 0 ? (
            <div className="empty-state-box">
              <p>No complaints registered yet. Use "Report Issue" to submit your first civic issue.</p>
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                isSelected={selectedComplaint?.id === c.id}
                onSelect={(comp) => setSelectedComplaint(comp)}
              />
            ))
          )}
        </div>

        {/* Tracking Details & Update History */}
        {selectedComplaint && (
          <TrackingTimeline complaint={selectedComplaint} />
        )}
      </div>

      <style>{`
        .my-complaints-root {
          background-color: var(--color-body-bg);
          padding: 44px 24px 80px;
          min-height: calc(100vh - 140px);
        }

        .complaints-container {
          max-width: 980px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 1.05rem;
          color: var(--color-text-muted);
        }

        /* Search Form */
        .search-form-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .search-input {
          flex: 1;
          background-color: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: var(--radius-md);
          padding: 14px 18px;
          font-size: 1rem;
          color: var(--color-text-main);
          outline: none;
        }

        .search-input:focus {
          border-color: #0f2942;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .btn-search {
          background-color: var(--color-amber-primary);
          color: #0f2942;
          font-size: 1rem;
          font-weight: 700;
          padding: 14px 32px;
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-search:hover {
          background-color: var(--color-amber-hover);
        }

        /* Filter Pills */
        .filter-pills-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .filter-pill {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: var(--color-text-main);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .filter-pill:hover {
          background-color: #f8fafc;
        }

        .filter-pill-active {
          background-color: #0e2439;
          border-color: #0e2439;
          color: #ffffff;
          font-weight: 700;
        }

        .complaints-list-section {
          margin-bottom: 12px;
        }

        .empty-state-box {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 40px;
          text-align: center;
          color: var(--color-text-muted);
          font-size: 1rem;
          box-shadow: var(--shadow-card);
        }

        @media (max-width: 640px) {
          .search-form-row {
            flex-direction: column;
            gap: 12px;
          }
          .search-input, .btn-search {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
