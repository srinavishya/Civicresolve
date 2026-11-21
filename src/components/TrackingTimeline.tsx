import React from 'react';
import { Complaint } from '../types';
import { Check } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

interface TrackingTimelineProps {
  complaint: Complaint;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ complaint }) => {
  // Determine milestone states based on complaint status and history
  const isReported = true; // Always true if complaint exists
  const isAssigned =
    complaint.status === 'In Progress' ||
    complaint.status === 'Resolved' ||
    complaint.updateHistory.some(u => u.type === 'assignment' || u.text.toLowerCase().includes('assigned'));
  const isInProgress = complaint.status === 'In Progress' || complaint.status === 'Resolved';
  const isResolved = complaint.status === 'Resolved';

  // Extract timestamps from history
  const reportedItem = complaint.updateHistory.find(u => u.type === 'created') || complaint.updateHistory[complaint.updateHistory.length - 1];
  const assignedItem = complaint.updateHistory.find(u => u.type === 'assignment' || u.text.toLowerCase().includes('assigned'));
  const inProgressItem = complaint.updateHistory.find(u => u.text.toLowerCase().includes('in progress'));
  const resolvedItem = complaint.updateHistory.find(u => u.text.toLowerCase().includes('resolved'));

  const reportedDate = reportedItem ? reportedItem.timestamp : complaint.createdAt;
  const assignedDate = assignedItem ? assignedItem.timestamp : (isAssigned ? '20 Nov, 2:15 PM' : 'Pending');
  const inProgressDate = inProgressItem ? inProgressItem.timestamp : (isInProgress ? '21 Nov, 8:30 AM' : 'Pending');
  const resolvedDate = resolvedItem ? resolvedItem.timestamp : (isResolved ? 'Completed' : 'Pending');

  return (
    <div className="tracking-wrapper">
      {/* Section Title */}
      <h2 className="tracking-section-title">
        Tracking details · {complaint.id}
      </h2>

      {/* Main Tracking Card */}
      <div className="tracking-main-card">
        {/* Top Header Row */}
        <div className="tracking-card-header">
          <div className="header-left">
            <div className="title-row">
              <span className="complaint-id-header">{complaint.id}</span>
              <span className="complaint-title-header">{complaint.title}</span>
            </div>
            <div className="meta-row">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
              <span className="dept-location-text">
                {complaint.department} · {complaint.location}
              </span>
            </div>
          </div>

          <div className="header-right">
            <span className="expected-label">Expected resolution by</span>
            <span className="expected-date">
              {complaint.expectedResolutionDate || '24 Nov 2026'}
            </span>
          </div>
        </div>

        {/* 4-Step Horizontal Timeline Stepper */}
        <div className="stepper-container">
          {/* Step 1: Reported */}
          <div className="step-item">
            <div className="step-node step-node-done">
              <Check size={16} strokeWidth={3} color="#ffffff" />
            </div>
            <span className="step-label">Reported</span>
            <span className="step-date">{reportedDate}</span>
          </div>

          {/* Connector 1-2 */}
          <div className={`step-line ${isAssigned ? 'step-line-active' : ''}`} />

          {/* Step 2: Assigned */}
          <div className="step-item">
            <div className={`step-node ${isAssigned ? 'step-node-done' : 'step-node-pending'}`}>
              {isAssigned ? <Check size={16} strokeWidth={3} color="#ffffff" /> : null}
            </div>
            <span className="step-label">Assigned</span>
            <span className="step-date">{assignedDate}</span>
          </div>

          {/* Connector 2-3 */}
          <div className={`step-line ${isInProgress ? 'step-line-active' : ''}`} />

          {/* Step 3: In Progress */}
          <div className="step-item">
            <div className={`step-node ${isResolved ? 'step-node-done' : isInProgress ? 'step-node-current' : 'step-node-pending'}`}>
              {isResolved ? (
                <Check size={16} strokeWidth={3} color="#ffffff" />
              ) : isInProgress ? (
                <div className="target-inner-dot" />
              ) : null}
            </div>
            <span className="step-label">In Progress</span>
            <span className="step-date">{inProgressDate}</span>
          </div>

          {/* Connector 3-4 */}
          <div className={`step-line ${isResolved ? 'step-line-active' : ''}`} />

          {/* Step 4: Resolved */}
          <div className="step-item">
            <div className={`step-node ${isResolved ? 'step-node-done' : 'step-node-pending'}`}>
              {isResolved ? <Check size={16} strokeWidth={3} color="#ffffff" /> : null}
            </div>
            <span className="step-label">Resolved</span>
            <span className="step-date">{resolvedDate}</span>
          </div>
        </div>

        {/* Latest Update Banner */}
        {complaint.latestUpdateNote && (
          <div className="latest-update-banner">
            Latest update: {complaint.latestUpdateNote.replace(/^Latest update:\s*/i, '')}
          </div>
        )}
      </div>

      {/* Update History Card */}
      <div className="update-history-card">
        <h3 className="history-title">Update history</h3>
        <div className="history-timeline">
          {complaint.updateHistory.map((item, idx) => {
            const isFirst = idx === 0;
            return (
              <div key={item.id || idx} className="history-item">
                <div className="history-dot-column">
                  <div className={`history-dot ${isFirst && complaint.status === 'In Progress' ? 'history-dot-blue' : 'history-dot-green'}`} />
                  {idx < complaint.updateHistory.length - 1 && <div className="history-line" />}
                </div>
                <div className="history-content">
                  <span className="history-timestamp">{item.timestamp}</span>
                  <span className="history-text">{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .tracking-wrapper {
          margin-top: 36px;
        }

        .tracking-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .tracking-main-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          padding: 32px 36px;
          margin-bottom: 24px;
        }

        .tracking-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 32px;
          border-bottom: 1px solid #f1f5f9;
          gap: 20px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .complaint-id-header {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-main);
        }

        .complaint-title-header {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .dept-location-text {
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          text-align: right;
        }

        .expected-label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .expected-date {
          font-size: 1.25rem;
          font-weight: 800;
          color: #15803d;
        }

        /* Stepper */
        .stepper-container {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 40px 10px 32px;
          position: relative;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 110px;
          z-index: 2;
        }

        .step-node {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          background-color: #ffffff;
          transition: all 0.2s ease;
        }

        .step-node-done {
          background-color: #10b981;
          box-shadow: 0 0 0 4px #ecfdf5;
        }

        .step-node-current {
          background-color: #ffffff;
          border: 3.5px solid #2563eb;
          box-shadow: 0 0 0 4px #eff6ff;
        }

        .target-inner-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #2563eb;
        }

        .step-node-pending {
          background-color: #ffffff;
          border: 3px solid #cbd5e1;
        }

        .step-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 4px;
        }

        .step-date {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .step-line {
          flex: 1;
          height: 3px;
          background-color: #e2e8f0;
          margin-top: 18px;
          position: relative;
          top: 0;
          z-index: 1;
        }

        .step-line-active {
          background-color: #10b981;
        }

        /* Banner */
        .latest-update-banner {
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 500;
          margin-top: 8px;
        }

        /* Update History Card */
        .update-history-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          padding: 28px 36px;
        }

        .history-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 24px;
        }

        .history-timeline {
          display: flex;
          flex-direction: column;
        }

        .history-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
          padding-bottom: 24px;
        }

        .history-item:last-child {
          padding-bottom: 0;
        }

        .history-dot-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 5px;
          width: 14px;
        }

        .history-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .history-dot-blue {
          background-color: #2563eb;
          box-shadow: 0 0 0 3px #dbeafe;
        }

        .history-dot-green {
          background-color: #10b981;
          box-shadow: 0 0 0 3px #dcfce7;
        }

        .history-line {
          width: 2px;
          flex: 1;
          background-color: #e2e8f0;
          margin-top: 6px;
          min-height: 24px;
        }

        .history-content {
          display: flex;
          align-items: baseline;
          gap: 24px;
          font-size: 0.95rem;
        }

        .history-timestamp {
          font-weight: 700;
          color: var(--color-text-main);
          white-space: nowrap;
          min-width: 120px;
        }

        .history-text {
          color: var(--color-text-main);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .tracking-main-card {
            padding: 24px 20px;
          }
          .tracking-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-right {
            align-items: flex-start;
          }
          .stepper-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .step-item {
            flex-direction: row;
            width: 100%;
            text-align: left;
            gap: 16px;
          }
          .step-node {
            margin-bottom: 0;
          }
          .step-line {
            display: none;
          }
          .history-content {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};
