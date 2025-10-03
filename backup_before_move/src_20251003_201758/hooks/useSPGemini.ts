/**
 * SP-Enhanced Gemini React Hook
 * Uses existing Gemini with SP methodology enhancement
 * 100% FREE - No additional costs
 */

import { useState, useCallback } from 'react';
import { spGeminiService } from '@/lib/ai/sp-gemini-service';

export interface UseSPGeminiResult {
  generateResponse: (prompt: string, domain?: string) => Promise<void>;
  response: string | null;
  loading: boolean;
  error: string | null;
  domain: string | null;
}

export function useSPGemini(): UseSPGeminiResult {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);

  const generateResponse = useCallback(async (prompt: string, requestDomain?: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setDomain(requestDomain || null);

    try {
      const result = await spGeminiService.generateSPResponse(prompt, requestDomain);
      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'SP Gemini request failed';
      setError(errorMessage);
      console.error('useSPGemini Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateResponse,
    response,
    loading,
    error,
    domain
  };
}

/**
 * Specialized hook for health with SP enhancement
 */
export function useSPHealthAdvice() {
  const gemini = useSPGemini();
  
  const analyzeHealthData = useCallback(async (healthData: any) => {
    return gemini.generateResponse(
      `Analyze this health data: ${JSON.stringify(healthData)}`,
      'health'
    );
  }, [gemini]);

  return {
    ...gemini,
    analyzeHealthData
  };
}

/**
 * Specialized hook for finance with SP enhancement
 */
export function useSPFinanceAdvice() {
  const gemini = useSPGemini();
  
  const analyzeFinanceData = useCallback(async (healthData: any) => {
    return gemini.generateResponse(
      `Analyze this financial data: ${JSON.stringify(healthData)}`,
      'finance'
    );
  }, [gemini]);

  return {
    ...gemini,
    analyzeFinanceData
  };
}
