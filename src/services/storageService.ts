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

const LOCAL_STORAGE_KEY = 'civicresolve_complaints_v1';

// Seed data matching the reference designs (CR-1024, CR-1022, CR-1021, CR-1019, CR-1025, CR-1026, CR-1027, CR-1028)
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CR-1024',
    title: 'Deep pothole near school gate',
    description: 'A deep pothole has opened up right outside the main gate of St. Mary school. Two bikes have already slipped, posing extreme danger during school pickup and drop hours.',
    citizenName: 'Priya',
    contact: '9876543210',
    location: 'Main Road',
    latitude: 13.0827,
    longitude: 80.2707,
    category: 'Potholes',
    priority: 'Critical',
    department: 'Roads & Highways',
    status: 'In Progress',
    createdAt: '20 Nov 2026, 9:10 AM',
    expectedResolutionDate: '24 Nov 2026',
    aiExplanation: 'Deep pothole near a school gate, high risk of accidents.',
    publicSafetyConcerns: 'Risk of vehicle skids and injury to schoolchildren during peak hours.',
    latestUpdateNote: 'Repair crew scheduled for Monday.',
    updateHistory: [
      {
        id: 'uh-1024-3',
        timestamp: '21 Nov, 8:30 AM',
        text: 'Status changed to In Progress. Admin note: repair crew scheduled.',
        type: 'status'
      },
      {
        id: 'uh-1024-2',
        timestamp: '20 Nov, 2:15 PM',
        text: 'Assigned to Roads & Highways.',
        type: 'assignment'
      },
      {
        id: 'uh-1024-1',
        timestamp: '20 Nov, 9:10 AM',
        text: 'Complaint received. AI result: Pothole, Critical priority.',
        type: 'created'
      }
    ]
  },
  {
    id: 'CR-1025',
    title: 'Water pipe leaking on street',
    description: 'Major potable water supply line ruptured causing continuous water logging across the residential lane and low water pressure in nearby houses.',
    citizenName: 'Karthik',
    contact: 'karthik@example.com',
    location: 'Gandhi Nagar',
    latitude: 13.0780,
    longitude: 80.2650,
    category: 'Water Leakage',
    priority: 'High',
    department: 'Water Supply',
    status: 'Reported',
    createdAt: '20 Nov 2026, 11:20 AM',
    expectedResolutionDate: '25 Nov 2026',
    aiExplanation: 'Continuous drinking water loss with potential structural weakening of street foundation.',
    publicSafetyConcerns: 'Water stagnation causing mosquito breeding and road erosion.',
    latestUpdateNote: 'Complaint received and queued for inspection.',
    updateHistory: [
      {
        id: 'uh-1025-1',
        timestamp: '20 Nov, 11:20 AM',
        text: 'Complaint received. AI result: Water Leakage, High priority.',
        type: 'created'
      }
    ]
  },
  {
    id: 'CR-1026',
    title: 'Streetlight not working',
    description: 'Three consecutive street lights on the main bus stand stretch have been dark for 4 days, causing safety concerns for night commuters.',
    citizenName: 'Ramesh',
    contact: '9840112233',
    location: 'Bus Stand Road',
    latitude: 13.0850,
    longitude: 80.2780,
    category: 'Streetlights',
    priority: 'High',
    department: 'Electricity Board',
    status: 'Reported',
    createdAt: '19 Nov 2026, 7:45 PM',
    expectedResolutionDate: '23 Nov 2026',
    aiExplanation: 'Key pedestrian corridor in darkness, increasing accident and crime risk.',
    publicSafetyConcerns: 'Poor night visibility for vehicles and pedestrians.',
    latestUpdateNote: 'Initial assessment completed.',
    updateHistory: [
      {
        id: 'uh-1026-1',
        timestamp: '19 Nov, 7:45 PM',
        text: 'Complaint received. AI result: Streetlight, High priority.',
        type: 'created'
      }
    ]
  },
  {
    id: 'CR-1027',
    title: 'Overflowing garbage bin',
    description: 'Community garbage dumpster has not been emptied for five days. Garbage is spilling onto pedestrian walkway and street.',
    citizenName: 'Meenakshi',
    contact: 'meenakshi@example.com',
    location: 'Market Street',
    latitude: 13.0890,
    longitude: 80.2820,
    category: 'Garbage',
    priority: 'Medium',
    department: 'Solid Waste',
    status: 'Resolved',
    createdAt: '18 Nov 2026, 10:15 AM',
    expectedResolutionDate: '20 Nov 2026',
    aiExplanation: 'Sanitation and public health hazard near food vendors and shops.',
    publicSafetyConcerns: 'Foul odor and pest attraction.',
    latestUpdateNote: 'Sanitation truck cleared the dump and sanitized area.',
    updateHistory: [
      {
        id: 'uh-1027-3',
        timestamp: '20 Nov, 11:00 AM',
        text: 'Status changed to Resolved. Dump cleared and sanitized.',
        type: 'status'
      },
      {
        id: 'uh-1027-2',
        timestamp: '19 Nov, 9:00 AM',
        text: 'Assigned to Solid Waste Management sanitation team.',
        type: 'assignment'
      },
      {
        id: 'uh-1027-1',
        timestamp: '18 Nov, 10:15 AM',
        text: 'Complaint received. AI result: Garbage, Medium priority.',
        type: 'created'
      }
    ]
  },
  {
    id: 'CR-1028',
    title: 'Cracked road surface',
    description: 'Multiple longitudinal fissures and minor surface degradation along the temple road approach.',
    citizenName: 'Anand',
    contact: 'anand@example.com',
    location: 'Temple Road',
    latitude: 13.0910,
    longitude: 80.2740,
    category: 'Road Damage',
    priority: 'Low',
    department: 'Roads & Highways',
    status: 'Reported',
    createdAt: '19 Nov 2026, 3:30 PM',
    expectedResolutionDate: '28 Nov 2026',
    aiExplanation: 'Surface wear without immediate loss of vehicle control.',
    publicSafetyConcerns: 'Minor vibration risk; needs scheduled repaving.',
    latestUpdateNote: 'Logged for seasonal road resurfacing schedule.',
    updateHistory: [
      {
        id: 'uh-1028-1',
        timestamp: '19 Nov, 3:30 PM',
        text: 'Complaint received. AI result: Road Damage, Low priority.',
        type: 'created'
      }
    ]
  },
  {
    id: 'CR-1022',
    title: 'Water pipe leaking on street',
    description: 'Leaking municipal water distribution valve flooding the corner curb in Gandhi Nagar.',
    citizenName: 'Priya',
    contact: '9876543210',
    location: 'Gandhi Nagar',
    latitude: 13.0780,
    longitude: 80.2650,
    category: 'Water Leakage',
    priority: 'High',
    department: 'Water Supply',
    status: 'In Progress',
    createdAt: '19 Nov 2026, 1:15 PM',
    expectedResolutionDate: '23 Nov 2026',
    aiExplanation: 'Constant water seepage weakening pavement sub-base.',
    publicSafetyConcerns: 'Slippery road surface.',
    latestUpdateNote: 'Plumbing unit dispatched for valve replacement.',
    updateHistory: [
      {
        id: 'uh-1022-2',
        timestamp: '20 Nov, 10:00 AM',
        text: 'Status changed to In Progress. Repair crew dispatched.',
        type: 'status'
      },
      {
        id: 'uh-1022-1',
        timestamp: '19 Nov, 1:15 PM',
        text: 'Complaint received. AI result: Water Leakage, High priority.',
        type: 'created'
      }
    ]
  },
  {
    id: 'CR-1021',
    title: 'Streetlight not working',
    description: 'Pole #14 lamp flickering and completely out at night on Bus Stand Road.',
    citizenName: 'Priya',
    contact: '9876543210',
    location: 'Bus Stand Road',
    latitude: 13.0850,
    longitude: 80.2780,
    category: 'Streetlights',
    priority: 'High',
    department: 'Electricity Board',
    status: 'Reported',
    createdAt: '19 Nov 2026, 9:20 AM',
    expectedResolutionDate: '22 Nov 2026',
    aiExplanation: 'Lamp ballast burned out on high-traffic street.',
    publicSafetyConcerns: 'Dark intersection during night hours.',
    latestUpdateNote: 'Reported to zonal electrical sub-station.',
    updateHistory: [
      {
        id: 'uh-1021-1',
        timestamp: '19 Nov, 9:20 AM',
        text: 'Complaint received. AI result: Streetlight, High priority.',
        type: 'created'
      }
    ]
  },
  {
    id: 'CR-1019',
    title: 'Overflowing garbage bin',
    description: 'Commercial wet waste overflowing from bin onto sidewalk near market square.',
    citizenName: 'Priya',
    contact: '9876543210',
    location: 'Market Street',
    latitude: 13.0890,
    longitude: 80.2820,
    category: 'Garbage',
    priority: 'Medium',
    department: 'Solid Waste',
    status: 'Resolved',
    createdAt: '18 Nov 2026, 8:40 AM',
    expectedResolutionDate: '19 Nov 2026',
    aiExplanation: 'Decomposition hazard and pedestrian walkway obstruction.',
    publicSafetyConcerns: 'Sanitation risk.',
    latestUpdateNote: 'Area cleared, swept and washed with bleaching powder.',
    updateHistory: [
      {
        id: 'uh-1019-2',
        timestamp: '19 Nov, 2:00 PM',
        text: 'Status changed to Resolved. Bin emptied and area sanitized.',
        type: 'status'
      },
      {
        id: 'uh-1019-1',
        timestamp: '18 Nov, 8:40 AM',
        text: 'Complaint received. AI result: Garbage, Medium priority.',
        type: 'created'
      }
    ]
  }
];

function getLocalStore(): Complaint[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPLAINTS;
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
 */
export async function getAllComplaints(): Promise<Complaint[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => doc.data() as Complaint);
      }
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
  
  // Generate next sequential ID: e.g. CR-1029
  const existingNumbers = all
    .map(c => {
      const match = c.id.match(/CR-(\d+)/i);
      return match ? parseInt(match[1], 10) : 1000;
    })
    .filter(n => !isNaN(n));
  
  const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1029;
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
 * Calculate aggregated statistics
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
