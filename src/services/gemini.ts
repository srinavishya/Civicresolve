import { AIAnalysisResult } from '../types';

export interface GeminiAnalysisResponse {
  success: boolean;
  data?: AIAnalysisResult;
  error?: string;
  isMockFallback?: boolean;
}

/**
 * Calls backend endpoint to analyze civic complaint with Google Gemini AI.
 * The Gemini API key remains strictly on the backend.
 * Supports English, Tamil, and Hindi.
 */
export async function analyzeComplaintWithGemini(
  title: string,
  description: string
): Promise<GeminiAnalysisResponse> {
  try {
    const response = await fetch('/api/analyze-complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error || `Server responded with status ${response.status}`
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: {
        category: result.category || 'Other',
        priority: result.priority || 'Medium',
        department: result.department || 'Public Works',
        explanation: result.explanation || 'Processed and evaluated by AI.',
        publicSafetyConcerns: result.publicSafetyConcerns
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error communicating with AI service'
    };
  }
}
