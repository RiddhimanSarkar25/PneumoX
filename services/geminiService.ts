import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

export interface AnalysisResponse {
  classification: ClassificationResult;
  confidence: number;
  report: string;
}

export const analyzeXrayImage = async (base64Image: string): Promise<AnalysisResponse> => {
  if (!GEMINI_API_KEY) {
    console.warn("No API Key found. Returning mock response.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      classification: ClassificationResult.BACTERIAL,
      confidence: 88.5,
      report: "Simulated analysis: Opacity detected in the lower left lung field suggesting bacterial infection. Please configure a valid API key for real-time analysis."
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Using gemini-2.5-flash-image for image analysis capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for simplicity in this demo context
              data: base64Image
            }
          },
          {
            text: `You are an expert medical radiologist AI. Analyze this chest X-ray image. 
            Identify if the scan appears Normal, or shows signs of Bacterial Pneumonia or Viral Pneumonia.
            Provide a confidence score (0-100) and a brief clinical report.
            
            Return the result in JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: {
              type: Type.STRING,
              enum: [ClassificationResult.NORMAL, ClassificationResult.BACTERIAL, ClassificationResult.VIRAL],
              description: "The diagnosis classification"
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence percentage (0-100)"
            },
            report: {
              type: Type.STRING,
              description: "A professional, concise radiologist report describing the findings."
            }
          },
          required: ["classification", "confidence", "report"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo stability
    return {
      classification: ClassificationResult.NORMAL,
      confidence: 0,
      report: "Analysis failed due to API error. Please check your connection and API key."
    };
  }
};