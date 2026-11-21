import React, { useState } from 'react';
import { Complaint } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Check, Copy } from 'lucide-react';

interface SubmissionResultPageProps {
  complaint: Complaint;
  onNavigate: (page: string) => void;
  onSelectComplaintForTracking: (complaint: Complaint) => void;
}

export const SubmissionResultPage: React.FC<SubmissionResultPageProps> = ({
  complaint,
  onNavigate,
  onSelectComplaintForTracking
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(complaint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewInComplaints = () => {
    onSelectComplaintForTracking(complaint);
    onNavigate('complaints');
  };

  return (
    <div className="submission-page-root">
      <div className="submission-card">
        {/* Success heading matching 3_Submission_Result.png */}
        <h1 className="submission-heading">Complaint received</h1>

        {/* Complaint ID row */}
        <div className="complaint-id-section">
          <span className="complaint-id-label">Your complaint ID</span>
          <div className="id-badge-and-copy">
            <span className="id-badge-large">{complaint.id}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="btn-copy-id"
              title="Copy Complaint ID"
            >
              {copied ? (
                <>
                  <Check size={16} color="#15803d" />
                  <span>Copied!</span>
                </>
              ) : (
                'Copy'
              )}
            </button>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="ai-analysis-block">
          <h2 className="ai-subhead">AI analysis</h2>

          {/* 2x2 Grid */}
          <div className="analysis-grid-2x2">
            {/* Box 1: Category */}
            <div className="analysis-box">
              <span className="box-label">Category</span>
              <span className="box-value-text">{complaint.category}</span>
            </div>

            {/* Box 2: Priority */}
            <div className="analysis-box">
              <span className="box-label">Priority</span>
              <div>
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>

            {/* Box 3: Recommended Department */}
            <div className="analysis-box">
              <span className="box-label">Recommended department</span>
              <span className="box-value-text">{complaint.department}</span>
            </div>

            {/* Box 4: Status */}
            <div className="analysis-box">
              <span className="box-label">Status</span>
              <div>
                <StatusBadge status={complaint.status} />
              </div>
            </div>
          </div>

          {/* Reason text underneath */}
          <p className="analysis-reason-text">
            <em>Reason: {complaint.aiExplanation || 'Complaint analyzed and registered for municipal action.'}</em>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="submission-actions-row">
          <button
            type="button"
            onClick={handleViewInComplaints}
            className="btn-primary btn-view-complaints"
          >
            View in My Complaints
          </button>
          <button
            type="button"
            onClick={() => onNavigate('report')}
            className="btn-outline-dark btn-report-another"
          >
            Report another
          </button>
        </div>
      </div>

      <style>{`
        .submission-page-root {
          background-color: var(--color-body-bg);
          padding: 60px 24px 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 140px);
        }

        .submission-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          max-width: 680px;
          width: 100%;
          padding: 44px 48px;
        }

        .submission-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #15803d; /* Matching green header */
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }

        .complaint-id-section {
          margin-bottom: 32px;
        }

        .complaint-id-label {
          display: block;
          font-size: 0.95rem;
          color: var(--color-text-muted);
          margin-bottom: 10px;
          font-weight: 500;
        }

        .id-badge-and-copy {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .id-badge-large {
          background-color: #0e2439;
          color: #ffffff;
          font-size: 1.35rem;
          font-weight: 800;
          padding: 10px 24px;
          border-radius: var(--radius-md);
          letter-spacing: 0.05em;
          display: inline-block;
        }

        .btn-copy-id {
          background-color: #ffffff;
          border: 1.5px solid #0e2439;
          color: #0e2439;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background-color 0.15s ease;
        }

        .btn-copy-id:hover {
          background-color: #f8fafc;
        }

        /* AI Analysis Block */
        .ai-analysis-block {
          margin-bottom: 36px;
        }

        .ai-subhead {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 16px;
        }

        .analysis-grid-2x2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 16px;
        }

        .analysis-box {
          background-color: #f8fafc;
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .box-label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .box-value-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .analysis-reason-text {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
        }

        /* Action Buttons */
        .submission-actions-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-view-complaints {
          padding: 14px 28px;
          font-size: 0.95rem;
          font-weight: 700;
        }

        .btn-report-another {
          padding: 14px 28px;
          font-size: 0.95rem;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .submission-card {
            padding: 30px 20px;
          }
          .submission-heading {
            font-size: 1.8rem;
          }
          .analysis-grid-2x2 {
            grid-template-columns: 1fr;
          }
          .submission-actions-row {
            flex-direction: column;
            width: 100%;
          }
          .btn-view-complaints, .btn-report-another {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
