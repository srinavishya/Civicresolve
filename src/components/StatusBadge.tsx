import React from 'react';
import { ComplaintStatus } from '../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Reported':
        return 'badge-status-reported';
      case 'In Progress':
        return 'badge-status-inprogress';
      case 'Resolved':
        return 'badge-status-resolved';
      default:
        return 'badge-status-reported';
    }
  };

  return <span className={`badge ${getStyle()}`}>{status}</span>;
};
