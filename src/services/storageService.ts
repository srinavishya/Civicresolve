import { Complaint, ComplaintStats, ComplaintStatus } from '../types';
import { isFirebaseConfigured, db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  orderBy
} from 'firebase/firestore';

// Versioned key to ensure fresh storage without stale mock data
const LOCAL_STORAGE_KEY = 'civicresolve_complaints_v2';

// Empty initial complaints for brand new platform
export const INITIAL_COMPLAINTS: Complaint[] = [];

function getLocalStore(): Complaint[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalStore(items: Complaint[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Fetch all complaints (from Firestore if configured, else from local storage)
 * If Firestore is empty, returns an empty array.
 */
export async function getAllComplaints(): Promise<Complaint[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => doc.data() as Complaint);
      }
      return [];
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local store:', e);
    }
  }
  return getLocalStore();
}

/**
 * Fetch complaint by ID
 */
export async function getComplaintById(id: string): Promise<Complaint | null> {
  const cleanId = id.trim().toUpperCase();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'complaints', cleanId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as Complaint;
      }
      return null;
    } catch (e) {
      console.warn('Firestore getDoc failed:', e);
    }
  }

  const all = getLocalStore();
  return all.find(c => c.id.toUpperCase() === cleanId) || null;
}

/**
 * Search complaints by query (ID, phone number or email)
 */
export async function searchComplaints(searchQuery: string): Promise<Complaint[]> {
  const term = searchQuery.trim().toLowerCase();
  if (!term) return [];

  const all = await getAllComplaints();
  return all.filter(c => {
    const idMatch = c.id.toLowerCase().includes(term);
    const titleMatch = c.title.toLowerCase().includes(term);
    const locationMatch = c.location.toLowerCase().includes(term);
    const contactMatch = c.contact ? c.contact.toLowerCase().includes(term) : false;
    const nameMatch = c.citizenName ? c.citizenName.toLowerCase().includes(term) : false;
    return idMatch || titleMatch || locationMatch || contactMatch || nameMatch;
  });
}

/**
 * Create a new complaint.
 * Ensures complaint is confirmed saved before resolving.
 */
export async function createComplaint(complaintData: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'updateHistory'>): Promise<Complaint> {
  const all = getLocalStore();
  
  // Generate next sequential ID: e.g. CR-1001
  const existingNumbers = all
    .map(c => {
      const match = c.id.match(/CR-(\d+)/i);
      return match ? parseInt(match[1], 10) : 1000;
    })
    .filter(n => !isNaN(n));
  
  const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1001;
  const newId = `CR-${nextNum}`;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formattedTimestamp = `${dateStr}, ${timeStr}`;

  const newComplaint: Complaint = {
    ...complaintData,
    id: newId,
    status: 'Reported',
    createdAt: formattedTimestamp,
    expectedResolutionDate: complaintData.expectedResolutionDate || new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    latestUpdateNote: 'Complaint received and queued for department review.',
    updateHistory: [
      {
        id: `uh-${nextNum}-1`,
        timestamp: formattedTimestamp,
        text: `Complaint received. AI result: ${complaintData.category}, ${complaintData.priority} priority.`,
        type: 'created'
      }
    ]
  };

  // 1. If Firebase is active, persist to Firestore
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'complaints', newId);
      await setDoc(docRef, newComplaint);
    } catch (e) {
      console.error('Firestore save failed:', e);
      throw new Error('Unable to record complaint in database. Please try again.');
    }
  }

  // 2. Persist to local store as well
  const updatedList = [newComplaint, ...all];
  saveLocalStore(updatedList);

  return newComplaint;
}

/**
 * Update complaint status, department, and add admin note
 */
export async function updateComplaintAdmin(
  id: string,
  updates: {
    status?: ComplaintStatus;
    department?: string;
    adminNote?: string;
  }
): Promise<Complaint> {
  const all = getLocalStore();
  const index = all.findIndex(c => c.id === id);

  if (index === -1) {
    throw new Error(`Complaint ${id} not found.`);
  }

  const existing = all[index];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const timestamp = `${dateStr}, ${timeStr}`;

  const newHistory = [...existing.updateHistory];
  let latestNote = existing.latestUpdateNote;

  if (updates.status && updates.status !== existing.status) {
    const noteText = updates.adminNote 
      ? `Status changed to ${updates.status}. Admin note: ${updates.adminNote}`
      : `Status changed to ${updates.status}.`;
    
    newHistory.unshift({
      id: `uh-${Date.now()}`,
      timestamp,
      text: noteText,
      type: 'status'
    });
    latestNote = noteText;
  } else if (updates.adminNote) {
    newHistory.unshift({
      id: `uh-${Date.now()}`,
      timestamp,
      text: `Admin note: ${updates.adminNote}`,
      type: 'status'
    });
    latestNote = updates.adminNote;
  }

  if (updates.department && updates.department !== existing.department) {
    newHistory.unshift({
      id: `uh-dept-${Date.now()}`,
      timestamp,
      text: `Assigned to ${updates.department}.`,
      type: 'assignment'
    });
  }

  const updatedComplaint: Complaint = {
    ...existing,
    status: updates.status || existing.status,
    department: updates.department || existing.department,
    latestUpdateNote: latestNote,
    updateHistory: newHistory
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'complaints', id);
      await updateDoc(docRef, {
        status: updatedComplaint.status,
        department: updatedComplaint.department,
        latestUpdateNote: updatedComplaint.latestUpdateNote,
        updateHistory: updatedComplaint.updateHistory
      });
    } catch (e) {
      console.warn('Firestore update failed:', e);
    }
  }

  all[index] = updatedComplaint;
  saveLocalStore(all);

  return updatedComplaint;
}

/**
 * Calculate aggregated statistics directly from actual records
 * If Firestore or local store is empty, all statistics return 0.
 */
export async function getComplaintStats(): Promise<ComplaintStats> {
  const all = await getAllComplaints();
  
  const reported = all.filter(c => c.status === 'Reported').length;
  const inProgress = all.filter(c => c.status === 'In Progress').length;
  const resolved = all.filter(c => c.status === 'Resolved').length;
  const criticalOpen = all.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;

  return {
    total: all.length,
    reported,
    inProgress,
    resolved,
    criticalOpen
  };
}
