import { GoogleGenAI, Type } from '@google/genai';
import { Task, Project } from '@/types';

// Accessing API key safely in Vite environment
const GEMINI_API_KEY = (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || '';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export interface ArbitrationResult {
  freelancerShare: number; // 0-100
  clientShare: number; // 0-100
  explanation: string;
  confidence: number; // 0-100
}

export const aiAnalyst = {
  analyzeDispute: async (project: Project, task: Task): Promise<ArbitrationResult> => {
    // If no key, return simulated response for demo
    if (!GEMINI_API_KEY) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            freelancerShare: 75,
            clientShare: 25,
            explanation:
              "Based on the delivery notes and the provided file architecture, 75% of requirements were met. The remaining 25% requires minor visual adjustments which don't block core functionality. Suggesting 75/25 split.",
            confidence: 94,
          });
        }, 2000);
      });
    }

    try {
      const prompt = `
        You are a Fintech Arbitration Analyst for Kafeel Escrow Platform.
        Analyze the following dispute between a Client and a Freelancer.
        
        PROJECT: ${project.title} (${project.description})
        TASK: ${task.name}
        PAYMENT VALUE: $${task.payment}
        DELIVERABLE NOTE: ${task.deliverableNote || 'No notes provided'}
        SUBMITTED AT: ${task.submittedAt || 'Not submitted'}
        
        Evaluate the completion and suggest a fair payment split (percentage).
        Provide a professional explanation for both parties.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              freelancerShare: {
                type: Type.NUMBER,
                description: 'Percentage for freelancer (0-100)',
              },
              clientShare: { type: Type.NUMBER, description: 'Percentage for client (0-100)' },
              explanation: {
                type: Type.STRING,
                description: 'Professional explanation for the split',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence score in analysis (0-100)',
              },
            },
            required: ['freelancerShare', 'clientShare', 'explanation', 'confidence'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      return result as ArbitrationResult;
    } catch (error) {
      console.error('AI Arbitration Error:', error);
      return {
        freelancerShare: 50,
        clientShare: 50,
        explanation: 'Arbitration engine timed out. Defaulting to 50/50 split for safety.',
        confidence: 0,
      };
    }
  },
};
