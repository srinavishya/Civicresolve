import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { X, AlertTriangle, MapPin, Shield } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';

interface AdminDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdate: (id: string, updates: { status?: ComplaintStatus; department?: string; adminNote?: string }) => Promise<void>;
}

export const AdminDetailModal: React.FC<AdminDetailModalProps> = ({
  complaint,
  onClose,
  onUpdate
}) => {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [department, setDepartment] = useState<string>(complaint.department);
  const [adminNote, setAdminNote] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const departmentsList = [
    'Roads & Highways',
    'Water Supply',
    'Electricity Board',
    'Solid Waste',
    'Public Works',
    'Traffic & Transit'
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(complaint.id, {
        status,
        department,
        adminNote: adminNote.trim() || undefined
      });
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-id-badge">{complaint.id}</span>
            <h2 className="modal-title">{complaint.title}</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="modal-body">
          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value flex-align">
                <MapPin size={15} color="#64748b" />
                {complaint.location}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Citizen Contact</span>
              <span className="detail-value">
                {complaint.citizenName || 'Anonymous'}{' '}
                {complaint.contact ? `(${complaint.contact})` : ''}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{complaint.category}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Priority</span>
              <div><PriorityBadge priority={complaint.priority} /></div>
            </div>
          </div>

          {/* Description */}
          <div className="section-block">
            <span className="section-label">Citizen Description</span>
            <div className="description-box">{complaint.description}</div>
          </div>

          {/* AI Explanation & Safety Concerns */}
          {complaint.aiExplanation && (
            <div className="ai-summary-box">
              <div className="ai-header">
                <Shield size={16} color="#0f2942" />
                <strong>Gemini AI Assessment</strong>
              </div>
              <p className="ai-text">{complaint.aiExplanation}</p>
              {complaint.publicSafetyConcerns && (
                <div className="safety-alert">
                  <AlertTriangle size={15} color="#ea580c" />
                  <span>{complaint.publicSafetyConcerns}</span>
                </div>
              )}
            </div>
          )}

          {/* Admin Management Form */}
          <form onSubmit={handleSave} className="admin-form">
            <h4 className="form-subhead">Update Status & Department</h4>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="field-label">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                  className="select-input"
                >
                  <option value="Reported">Reported</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label">Assigned Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="select-input"
                >
                  {departmentsList.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Add Admin Note / Progress Update</label>
              <input
                type="text"
                placeholder="e.g. Repair crew scheduled for Monday, asphalt dispatched..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="text-input"
              />
              <span className="field-help">This note will appear in the citizen's live tracking timeline.</span>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-modal-cancel">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-modal-save">
                {saving ? 'Saving...' : savedSuccess ? 'Updated!' : 'Save Updates'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 41, 66, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          backdrop-filter: blur(2px);
        }

        .modal-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          max-width: 650px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          border-bottom: 1px solid #f1f5f9;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-id-badge {
          background-color: #0f2942;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-main);
        }

        .modal-close-btn {
          color: #64748b;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .modal-body {
          padding: 24px 28px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
          background-color: #f8fafc;
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .detail-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f2942;
        }

        .flex-align {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .section-block {
          margin-bottom: 20px;
        }

        .section-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          display: block;
          margin-bottom: 6px;
        }

        .description-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 14px;
          font-size: 0.92rem;
          color: #1e293b;
          line-height: 1.5;
        }

        .ai-summary-box {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          margin-bottom: 24px;
        }

        .ai-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: #166534;
          margin-bottom: 6px;
        }

        .ai-text {
          font-size: 0.9rem;
          color: #1e293b;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .safety-alert {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #c2410c;
          font-weight: 600;
        }

        .admin-form {
          border-top: 1.5px dashed #e2e8f0;
          padding-top: 20px;
        }

        .form-subhead {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f2942;
          margin-bottom: 16px;
        }

        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .field-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f2942;
          margin-bottom: 6px;
        }

        .select-input, .text-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          color: #0f2942;
          background-color: #ffffff;
          outline: none;
        }

        .select-input:focus, .text-input:focus {
          border-color: #0f2942;
        }

        .field-help {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 4px;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-modal-cancel {
          background-color: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #475569;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn-modal-save {
          background-color: var(--color-amber-primary);
          border: none;
          color: #0f2942;
          padding: 10px 24px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
