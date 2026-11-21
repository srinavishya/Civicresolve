import React, { useState } from 'react';
import { Camera, MapPin, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { Complaint, ComplaintCategory } from '../types';
import { optimizeImage } from '../services/imageOptimizer';
import { analyzeComplaintWithGemini } from '../services/gemini';
import { createComplaint } from '../services/storageService';
import { MapPicker } from '../components/MapPicker';

interface ReportIssuePageProps {
  initialCategory?: string;
  onSubmissionSuccess: (complaint: Complaint) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  initialCategory,
  onSubmissionSuccess
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [category, setCategory] = useState<string>(initialCategory || 'auto');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('No file chosen');

  // UI state
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStepText, setSubmitStepText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFileName(file.name);
    try {
      const optimized = await optimizeImage(file, 1200, 0.8);
      setPhotoDataUrl(optimized);
    } catch (err: any) {
      console.warn('Image optimization skipped, using raw preview:', err);
      const reader = new FileReader();
      reader.onload = () => setPhotoDataUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLocationPicked = (address: string, lat: number, lng: number) => {
    setLocation(address);
    setCoords({ lat, lng });
    setShowMap(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!title.trim()) {
      setErrorMessage('Please provide a complaint title.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please enter a description of the issue.');
      return;
    }
    if (!location.trim()) {
      setErrorMessage('Please specify the location or landmark.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStepText('AI analyzing complaint with Google Gemini...');

    try {
      let finalCategory: ComplaintCategory =
        category !== 'auto' ? (category as ComplaintCategory) : 'Other';
      let finalPriority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
      let finalDepartment = 'Public Works';
      let finalExplanation = 'Reported by citizen and queued for department assignment.';
      let finalSafetyConcerns: string | undefined = undefined;

      // 1. Backend Gemini AI Analysis
      const aiResponse = await analyzeComplaintWithGemini(title, description);

      if (aiResponse.success && aiResponse.data) {
        // AI analysis succeeded
        if (category === 'auto') {
          finalCategory = aiResponse.data.category;
        }
        finalPriority = aiResponse.data.priority;
        finalDepartment = aiResponse.data.department;
        finalExplanation = aiResponse.data.explanation;
        finalSafetyConcerns = aiResponse.data.publicSafetyConcerns;
      } else {
        // Graceful handling of AI failure
        console.warn('AI analysis note:', aiResponse.error);
        if (category === 'auto') {
          // Intelligent heuristic fallback based on keywords
          const descLower = description.toLowerCase();
          if (descLower.includes('pothole') || descLower.includes('குழி') || descLower.includes('गड्ढा')) {
            finalCategory = 'Potholes';
            finalPriority = 'High';
            finalDepartment = 'Roads & Highways';
          } else if (descLower.includes('garbage') || descLower.includes('குப்பை') || descLower.includes('कचरा')) {
            finalCategory = 'Garbage';
            finalPriority = 'Medium';
            finalDepartment = 'Solid Waste';
          } else if (descLower.includes('light') || descLower.includes('விளக்கு') || descLower.includes('लाइट')) {
            finalCategory = 'Streetlights';
            finalPriority = 'High';
            finalDepartment = 'Electricity Board';
          } else if (descLower.includes('water') || descLower.includes('leak') || descLower.includes('தண்ணீர்') || descLower.includes('पानी')) {
            finalCategory = 'Water Leakage';
            finalPriority = 'High';
            finalDepartment = 'Water Supply';
          } else {
            finalCategory = 'Road Damage';
            finalPriority = 'Medium';
            finalDepartment = 'Roads & Highways';
          }
          finalExplanation = `Categorized based on citizen report: ${title}. High priority civic attention needed.`;
        }
      }

      setSubmitStepText('Saving confirmed complaint to database...');

      // 2. Persist to Firestore / Storage
      const newComplaint = await createComplaint({
        title: title.trim(),
        description: description.trim(),
        citizenName: name.trim() || undefined,
        contact: contact.trim() || undefined,
        location: location.trim(),
        latitude: coords.lat,
        longitude: coords.lng,
        category: finalCategory,
        priority: finalPriority,
        department: finalDepartment,
        photoUrl: photoDataUrl || undefined,
        aiExplanation: finalExplanation,
        publicSafetyConcerns: finalSafetyConcerns
      });

      // 3. Only transition after confirmed database save
      onSubmissionSuccess(newComplaint);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitStepText('');
    }
  };

  return (
    <div className="report-page-root">
      {/* Header text matching 2_Report_Issue.png */}
      <div className="report-header-container">
        <h1 className="report-title">Report an Issue</h1>
        <p className="report-subtitle">
          Tell us what is wrong. Gemini will sort out the rest.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="report-form-card">
        {errorMessage && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Row 1: Name & Contact */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="citizen-name">
                Your name (optional)
              </label>
              <input
                id="citizen-name"
                type="text"
                className="form-control"
                placeholder="e.g. Priya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="citizen-contact">
                Phone or email (optional)
              </label>
              <input
                id="citizen-contact"
                type="text"
                className="form-control"
                placeholder="To find your complaints later"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Row 2: Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="complaint-title">
              Title
            </label>
            <input
              id="complaint-title"
              type="text"
              className="form-control"
              placeholder="e.g. Deep pothole near school gate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Row 3: Description (English, Tamil or Hindi) */}
          <div className="form-group">
            <div className="desc-label-row">
              <label className="form-label" htmlFor="complaint-description">
                Description (English, Tamil or Hindi)
              </label>
              <span className="lang-support-badge">
                English · தமிழ் · हिन्दी
              </span>
            </div>
            <textarea
              id="complaint-description"
              rows={5}
              className="form-control textarea-control"
              placeholder="Describe the problem"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Row 4: Location & Category */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="complaint-location">
                Location
              </label>
              <div className="location-input-wrapper">
                <input
                  id="complaint-location"
                  type="text"
                  className="form-control"
                  placeholder="Street, landmark or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="btn-map-toggle"
                  onClick={() => setShowMap(!showMap)}
                  title="Select on map"
                >
                  <MapPin size={18} color="#0f2942" />
                  <span>Map</span>
                </button>
              </div>

              {/* Collapsible Leaflet OpenStreetMap Picker */}
              {showMap && (
                <MapPicker
                  initialAddress={location}
                  onLocationSelect={handleLocationPicked}
                  onClose={() => setShowMap(false)}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="complaint-category">
                Category
              </label>
              <div className="select-wrapper">
                <select
                  id="complaint-category"
                  className="form-control custom-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="auto">Auto-detect with AI</option>
                  <option value="Potholes">Potholes</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Streetlights">Streetlights</option>
                  <option value="Water Leakage">Water Leakage</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Other">Other</option>
                </select>
                <div className="select-arrow" aria-hidden="true">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Photo (optional) */}
          <div className="form-group">
            <label className="form-label">Photo (optional)</label>
            <div className="file-input-box">
              <label className="btn-choose-file">
                <Upload size={16} />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden-file-input"
                />
              </label>

              {/* Mobile camera capture option */}
              <label className="btn-camera-capture">
                <Camera size={16} />
                <span>Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden-file-input"
                />
              </label>

              <span className="file-name-text">{photoFileName}</span>
            </div>

            {/* Photo preview thumbnail */}
            {photoDataUrl && (
              <div className="photo-preview-bar">
                <img src={photoDataUrl} alt="Preview" className="photo-thumb" />
                <span className="photo-opt-info">Image optimized for quick upload</span>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoDataUrl(null);
                    setPhotoFileName('No file chosen');
                  }}
                  className="btn-remove-photo"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-action-row">
            <button
              type="submit"
              className="btn-primary btn-submit-complaint"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>{submitStepText || 'Submitting...'}</span>
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .report-page-root {
          background-color: var(--color-body-bg);
          padding: 48px 24px 80px;
          min-height: calc(100vh - 140px);
        }

        .report-header-container {
          max-width: 820px;
          margin: 0 auto 28px;
        }

        .report-title {
          font-size: 2.35rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .report-subtitle {
          font-size: 1.05rem;
          color: var(--color-text-muted);
        }

        .report-form-card {
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          max-width: 820px;
          margin: 0 auto;
          padding: 36px 40px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .desc-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .desc-label-row .form-label {
          margin-bottom: 0;
        }

        .lang-support-badge {
          font-size: 0.8rem;
          font-weight: 600;
          color: #0284c7;
          background-color: #e0f2fe;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .textarea-control {
          resize: vertical;
          min-height: 120px;
          line-height: 1.5;
        }

        .location-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .location-input-wrapper .form-control {
          padding-right: 90px;
        }

        .btn-map-toggle {
          position: absolute;
          right: 6px;
          background-color: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #0f2942;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-map-toggle:hover {
          background-color: #e2e8f0;
        }

        .select-wrapper {
          position: relative;
        }

        .custom-select {
          appearance: none;
          cursor: pointer;
          padding-right: 36px;
        }

        .select-arrow {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 0.75rem;
          color: #64748b;
        }

        .file-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: #f1f5f9;
          border: 1.5px solid #cbd5e1;
          border-radius: var(--radius-md);
          padding: 10px 14px;
        }

        .hidden-file-input {
          display: none;
        }

        .btn-choose-file, .btn-camera-capture {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f2942;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-choose-file:hover, .btn-camera-capture:hover {
          background-color: #f8fafc;
        }

        .file-name-text {
          font-size: 0.9rem;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .photo-preview-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .photo-thumb {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 6px;
        }

        .photo-opt-info {
          font-size: 0.82rem;
          color: #15803d;
          font-weight: 500;
          flex: 1;
        }

        .btn-remove-photo {
          color: #dc2626;
          font-size: 0.85rem;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
        }

        .form-action-row {
          margin-top: 28px;
        }

        .btn-submit-complaint {
          padding: 14px 32px;
          font-size: 1rem;
          font-weight: 700;
        }

        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-alert {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 0.92rem;
        }

        @media (max-width: 768px) {
          .report-form-card {
            padding: 24px 20px;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .file-input-box {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};
