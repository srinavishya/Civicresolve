# CivicResolve – Civic Issue Management Platform

CivicResolve is a civic issue reporting and resolution platform powered by Google Gemini AI, Firebase, and OpenStreetMap.

The platform provides a streamlined reporting process for citizens across multiple languages (English, Tamil, Hindi) and an administrative dashboard for municipal department assignment and issue resolution tracking.

---

## 1. Visual Design Fidelity

CivicResolve is built to faithfully match all six design reference specifications in `design-references/`:

| Page | Reference Image | Key UI & Functional Elements |
|---|---|---|
| **1. Home** | `1_Home.png` | Dark navy navigation, hero with "Report a civic issue in under a minute", geometric skyline silhouette with window patterns, 4 stat cards with accent top borders (Navy, Blue, Green, Red), 4-step "How it works" cards, 5 civic category cards (Potholes, Garbage, Streetlights, Water Leakage, Road Damage), and navy footer. |
| **2. Report Issue** | `2_Report_Issue.png` | Centered white card with rounded corners, optional citizen name & contact, title, multilingual description (English, Tamil, Hindi), interactive location with Leaflet map picker & device GPS, AI auto-detect category dropdown, file upload + mobile camera capture, and warm amber submit button. |
| **3. Submission Result** | `3_Submission_Result.png` | Centered card, green "Complaint received" title, complaint ID badge (e.g., `CR-1024`) with copy to clipboard, 2x2 AI analysis summary (Category, Priority, Department, Status), AI reasoning text, and action buttons ("View in My Complaints", "Report another"). Only displayed after confirmed database save. |
| **4. My Complaints** | `4_My_Complaints.png` | Search bar by Complaint ID/phone/email, status filter pills (`All`, `Reported`, `In Progress`, `Resolved`), complaint list cards with priority & status badges and 3-step progress indicators, active card amber border, detailed 4-milestone stepper (Reported, Assigned, In Progress, Resolved) with expected resolution date, latest update alert banner, and update history log. |
| **5. Admin Login** | `5_Admin_Login.png` | Clean staff login card with password field and warm amber "Login" button, secured by Firebase Authentication. |
| **6. Admin Dashboard** | `6_Admin_Dashboard.png` | Real-time statistics cards, status/priority/department filter dropdowns, complaint data table with direct inline status updates, and interactive modal for department assignment, full description review, safety alert inspection, and admin notes. |

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Custom CSS adhering to typography, color palette (`#0f2942` Navy, `#f59e0b` Amber, `#f4f7fb` Canvas), and layout standards
- **Database**: Firebase Firestore (`firestore.rules` included)
- **File Storage**: Firebase Storage (`storage.rules` included)
- **Authentication**: Firebase Authentication
- **AI Intelligence**: Google Gemini API via secure backend endpoint
- **Backend / Serverless**: Vite backend middleware & Firebase Cloud Functions
- **Maps & Geolocation**: Leaflet & OpenStreetMap
- **Icons**: Lucide React & custom SVG elements

---

## 3. Citizen-Facing Statuses

The application strictly implements the three citizen-facing complaint stages:
1. **Reported**: Complaint has been registered and analyzed by AI.
2. **In Progress**: Municipal authority has assigned the complaint to a field crew.
3. **Resolved**: Maintenance or repair crew has completed the work and sanitized the area.

---

## 4. Google Gemini AI Integration

Gemini AI is connected exclusively through a secure backend proxy to prevent exposing the API key in client bundles:

1. **Development**: Handled by the Vite development server middleware (`/api/analyze-complaint`).
2. **Production**: Handled by Firebase Cloud Functions (`functions/index.js`).
3. **Capabilities**:
   - Analyzes complaint descriptions submitted in **English**, **Tamil (தமிழ்)**, or **Hindi (हिन्दी)**.
   - Extracts structured JSON with `category`, `priority` (Critical/High/Medium/Low), `department`, `explanation`, and `publicSafetyConcerns`.
   - **Graceful Failure**: If the Gemini API key is missing or an error occurs, the application provides an error notice and allows manual categorization without faking AI success.

---

## 5. Setup & Installation

### Prerequisites
- Node.js (v18 or v20+)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Civicresolve
npm install
```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Populate the `.env` file:
```env
# Google Gemini API Key (Backend)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web App Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Administrator Access Password
VITE_ADMIN_PASSWORD=admin123
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 6. Firebase Configuration & Deployment

### Firestore & Storage Rules
The repository includes production security rules:
- `firestore.rules`: Allows citizens to create complaints and look up issues; restricts updates to authenticated staff.
- `storage.rules`: Allows citizen image evidence uploads (<5MB) and public read access.

### Deploying to Firebase
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Authenticate:
   ```bash
   firebase login
   ```
3. Initialize project:
   ```bash
   firebase use --add
   ```
4. Build frontend:
   ```bash
   npm run build
   ```
5. Deploy Hosting, Functions, Firestore rules, and Storage rules:
   ```bash
   firebase deploy
   ```

---

## 7. Quality & Verification Checks

- **TypeScript Compilation**: `npm run build` verifies zero TypeScript compiler errors.
- **Offline / Standalone Fallback**: Includes pre-seeded municipal complaints (`CR-1024`, `CR-1025`, `CR-1026`, `CR-1027`, `CR-1028`, `CR-1022`, `CR-1021`, `CR-1019`) matching the design specifications, allowing full interactive testing even before Firebase API keys are linked.
- **Client-Side Image Compression**: Photos taken on mobile cameras are automatically compressed via HTML5 Canvas before uploading.
- **Responsive Layout**: Designed for mobile smartphones (iOS Safari, Android Chrome), tablets, and desktop displays.
