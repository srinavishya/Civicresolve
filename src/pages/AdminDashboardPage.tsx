import React, { useEffect, useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { AdminDetailModal } from '../components/AdminDetailModal';
import { getAllComplaints, updateComplaintAdmin } from '../services/storageService';
import { ChevronDown, LogOut } from 'lucide-react';

interface AdminDashboardPageProps {
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const list = await getAllComplaints();
    setComplaints(list);
  };

  const handleQuickStatusChange = async (
    e: React.MouseEvent,
    complaintId: string,
    newStatus: ComplaintStatus
  ) => {
    e.stopPropagation();
    try {
      await updateComplaintAdmin(complaintId, { status: newStatus });
      await loadComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalUpdate = async (
    id: string,
    updates: { status?: ComplaintStatus; department?: string; adminNote?: string }
  ) => {
    await updateComplaintAdmin(id, updates);
    await loadComplaints();
  };

  // Stats calculation connected to actual complaint records (defaults to 0 when empty)
  const totalCount = complaints.length;
  const reportedCount = complaints.filter(c => c.status === 'Reported').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  // Filtered rows
  const filteredList = complaints.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (departmentFilter !== 'all' && !c.department.toLowerCase().includes(departmentFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="admin-dashboard-root">
      <div className="dashboard-container">
        {/* Header matching 6_Admin_Dashboard.png */}
        <div className="dashboard-header-row">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <button onClick={onLogout} className="btn-logout" title="Sign out of admin session">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 4 Stats Cards matching 6_Admin_Dashboard.png */}
        <div className="admin-stats-row">
          <div className="admin-stat-card border-navy">
            <span className="admin-stat-num">{totalCount}</span>
            <span className="admin-stat-lbl">Total</span>
          </div>

          <div className="admin-stat-card border-navy">
            <span className="admin-stat-num">{reportedCount}</span>
            <span className="admin-stat-lbl">Reported</span>
          </div>

          <div className="admin-stat-card border-blue">
            <span className="admin-stat-num">{inProgressCount}</span>
            <span className="admin-stat-lbl">In Progress</span>
          </div>

          <div className="admin-stat-card border-green">
            <span className="admin-stat-num">{resolvedCount}</span>
            <span className="admin-stat-lbl">Resolved</span>
          </div>
        </div>

        {/* Filter Dropdowns row matching 6_Admin_Dashboard.png */}
        <div className="admin-filters-row">
          <div className="filter-dropdown-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All statuses</option>
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <ChevronDown size={14} className="dropdown-caret" />
          </div>

          <div className="filter-dropdown-wrapper">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown size={14} className="dropdown-caret" />
          </div>

          <div className="filter-dropdown-wrapper">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All departments</option>
              <option value="Roads & Highways">Roads & Highways</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity Board">Electricity Board</option>
              <option value="Solid Waste">Solid Waste</option>
              <option value="Public Works">Public Works</option>
            </select>
            <ChevronDown size={14} className="dropdown-caret" />
          </div>
        </div>

        {/* Complaints Table matching 6_Admin_Dashboard.png */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                      No complaints found in database.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className="table-row-clickable"
                    >
                      <td className="cell-id">{c.id}</td>
                      <td className="cell-title">{c.title}</td>
                      <td className="cell-location">{c.location}</td>
                      <td className="cell-category">{c.category}</td>
                      <td className="cell-priority">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="cell-dept">{c.department}</td>
                      <td className="cell-status" onClick={(e) => e.stopPropagation()}>
                        <div className="status-dropdown-wrapper">
                          <select
                            value={c.status}
                            onChange={(e) => handleQuickStatusChange(e as any, c.id, e.target.value as ComplaintStatus)}
                            className="status-inline-select"
                          >
                            <option value="Reported">Reported</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <ChevronDown size={14} className="status-caret" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Detail & Editing Modal */}
        {selectedComplaint && (
          <AdminDetailModal
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onUpdate={handleModalUpdate}
          />
        )}
      </div>

      <style>{`
        .admin-dashboard-root {
          background-color: var(--color-body-bg);
          padding: 44px 32px 80px;
          min-height: calc(100vh - 140px);
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .dashboard-title {
          font-size: 2.35rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
        }

        .btn-logout {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-logout:hover {
          background-color: #f1f5f9;
          color: #0f2942;
        }

        /* 4 Stats Cards */
        .admin-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .admin-stat-card {
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

        .admin-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .border-navy::before {
          background-color: #0f2942;
        }

        .border-blue::before {
          background-color: #2563eb;
        }

        .border-green::before {
          background-color: #10b981;
        }

        .admin-stat-num {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
        }

        .admin-stat-lbl {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        /* Filters Row */
        .admin-filters-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-dropdown-wrapper {
          position: relative;
          min-width: 170px;
        }

        .admin-select {
          width: 100%;
          appearance: none;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-md);
          padding: 10px 36px 10px 16px;
          font-size: 0.95rem;
          color: var(--color-text-main);
          cursor: pointer;
          font-weight: 500;
          outline: none;
        }

        .dropdown-caret {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #64748b;
        }

        /* Table Card */
        .table-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th {
          background-color: #ffffff;
          color: #64748b;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 18px 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .admin-table td {
          padding: 18px 24px;
          border-bottom: 1px solid #f8fafc;
          font-size: 0.95rem;
          color: var(--color-text-main);
        }

        .table-row-clickable {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .table-row-clickable:hover {
          background-color: #f8fafc;
        }

        .cell-id {
          font-weight: 700;
          color: var(--color-text-main);
          white-space: nowrap;
        }

        .cell-title {
          font-weight: 600;
          min-width: 200px;
        }

        .cell-location {
          color: #475569;
        }

        .cell-category {
          color: #475569;
        }

        .cell-dept {
          color: #475569;
          white-space: nowrap;
        }

        /* Status Inline Select */
        .status-dropdown-wrapper {
          position: relative;
          display: inline-block;
          min-width: 140px;
        }

        .status-inline-select {
          appearance: none;
          background-color: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: var(--radius-md);
          padding: 7px 30px 7px 14px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-main);
          cursor: pointer;
          outline: none;
          width: 100%;
        }

        .status-caret {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #64748b;
        }

        @media (max-width: 1024px) {
          .admin-stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .admin-stats-row {
            grid-template-columns: 1fr;
          }
          .dashboard-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};
