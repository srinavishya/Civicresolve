import React from 'react';
import { Complaint } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

interface ComplaintCardProps {
  complaint: Complaint;
  isSelected?: boolean;
  onSelect: (complaint: Complaint) => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  isSelected = false,
  onSelect
}) => {
  // Render mini progress bar matching 4_My_Complaints.png (3 segments)
  const renderProgressMiniBar = () => {
    let seg1 = '#cbd5e1';
    let seg2 = '#cbd5e1';
    let seg3 = '#cbd5e1';

    if (complaint.status === 'Reported') {
      seg1 = '#10b981'; // Green
      seg2 = '#3b82f6'; // Blue
      seg3 = '#cbd5e1'; // Gray
    } else if (complaint.status === 'In Progress') {
      seg1 = '#10b981'; // Green
      seg2 = '#3b82f6'; // Blue
      seg3 = '#cbd5e1'; // Gray
    } else if (complaint.status === 'Resolved') {
      seg1 = '#10b981'; // Green
      seg2 = '#10b981'; // Green
      seg3 = '#10b981'; // Green
    }

    return (
      <div className="mini-progress-bar" aria-hidden="true">
        <span className="progress-seg" style={{ backgroundColor: seg1 }} />
        <span className="progress-seg" style={{ backgroundColor: seg2 }} />
        <span className="progress-seg" style={{ backgroundColor: seg3 }} />
      </div>
    );
  };

  return (
    <div className={`complaint-card-root ${isSelected ? 'complaint-card-selected' : ''}`}>
      <div className="card-left-section">
        <h3 className="card-title">{complaint.title}</h3>
        <p className="card-meta">
          {complaint.id} · {complaint.location} · {complaint.createdAt.split(',')[0]}
        </p>
      </div>

      <div className="card-right-section">
        <div className="badge-group">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>

        {renderProgressMiniBar()}

        <button
          type="button"
          onClick={() => onSelect(complaint)}
          className="btn-view-details"
        >
          View details
        </button>
      </div>

      <style>{`
        .complaint-card-root {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }

        .complaint-card-root:hover {
          box-shadow: var(--shadow-card-hover);
        }

        .complaint-card-selected {
          border-left: 4px solid var(--color-amber-primary);
        }

        .card-left-section {
          flex: 1;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 6px;
        }

        .card-meta {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .card-right-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .badge-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mini-progress-bar {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .progress-seg {
          width: 32px;
          height: 5px;
          border-radius: 4px;
          display: inline-block;
        }

        .btn-view-details {
          background-color: #ffffff;
          border: 1.5px solid var(--color-primary-navy);
          color: var(--color-text-main);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: var(--radius-md);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .btn-view-details:hover {
          background-color: #f8fafc;
        }

        @media (max-width: 860px) {
          .complaint-card-root {
            flex-direction: column;
            align-items: flex-start;
          }
          .card-right-section {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};
