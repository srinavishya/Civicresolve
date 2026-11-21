export type ComplaintStatus = 'Reported' | 'In Progress' | 'Resolved';

export type ComplaintPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintCategory =
  | 'Potholes'
  | 'Pothole'
  | 'Garbage'
  | 'Streetlights'
  | 'Water Leakage'
  | 'Road Damage'
  | 'Other';

export interface TimelineMilestone {
  label: 'Reported' | 'Assigned' | 'In Progress' | 'Resolved';
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isPending: boolean;
}

export interface UpdateHistoryEntry {
  id: string;
  timestamp: string;
  text: string;
  type?: 'status' | 'assignment' | 'created';
}

export interface Complaint {
  id: string; // e.g., 'CR-1024'
  title: string;
  description: string;
  citizenName?: string;
  contact?: string; // phone or email
  location: string;
  latitude?: number;
  longitude?: number;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  department: string;
  status: ComplaintStatus;
  createdAt: string;
  expectedResolutionDate?: string;
  photoUrl?: string;
  aiExplanation?: string;
  publicSafetyConcerns?: string;
  latestUpdateNote?: string;
  updateHistory: UpdateHistoryEntry[];
}

export interface ComplaintStats {
  total: number;
  reported: number;
  inProgress: number;
  resolved: number;
  criticalOpen: number;
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  priority: ComplaintPriority;
  department: string;
  explanation: string;
  publicSafetyConcerns?: string;
}
