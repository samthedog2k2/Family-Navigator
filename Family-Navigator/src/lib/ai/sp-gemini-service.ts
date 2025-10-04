/**
 * SP-Enhanced Gemini Service
 * Applies SP methodology to existing Genkit setup
 * 100% FREE - No additional API keys needed
 */

// Import your existing Genkit setup
import { ai } from '@/ai/genkit';

export class SPGeminiService {
  /**
   * Apply SP methodology to Gemini prompts
   * Embodies collective wisdom of 200+ experts
   */
  private enhancePromptWithSP(prompt: string, domain?: string): string {
    const expertWisdom = this.getExpertWisdomForDomain(domain);
    
    return `
${expertWisdom}

User Request: ${prompt}

Apply the collective expertise above to provide a comprehensive, production-ready response.
Focus on practical, actionable solutions with specific implementation details.
`;
  }

  /**
   * Get relevant expert wisdom for domain
   */
  private getExpertWisdomForDomain(domain?: string): string {
    const baseWisdom = `
Embodying collective wisdom of:
- Steve Jobs: Simplicity and user-focused design
- W. Edwards Deming: Quality-first methodology
- Martin Fowler: Clean architecture patterns
`;

    switch (domain?.toLowerCase()) {
      case 'health':
        return baseWisdom + `
- Medical experts: Evidence-based health insights
- Wellness specialists: Holistic health approaches
- Data scientists: Health trend analysis
`;

      case 'finance':
        return baseWisdom + `
- Financial advisors: Personal finance best practices
- Investment experts: Smart money management
- Budgeting specialists: Practical saving strategies
`;

      case 'travel':
        return baseWisdom + `
- Travel experts: Efficient trip planning
- Logistics specialists: Optimal routing and timing
- Cultural advisors: Local insights and recommendations
`;

      case 'calendar':
        return baseWisdom + `
- Productivity experts: Time management strategies
- Scheduling specialists: Optimal calendar organization
- Work-life balance coaches: Healthy routine planning
`;

      default:
        return baseWisdom + `
- General problem-solving experts
- System architects: Scalable solutions
- User experience designers: Intuitive interfaces
`;
    }
  }

  /**
   * Generate SP-enhanced response using existing Gemini
   */
  async generateSPResponse(prompt: string, domain?: string): Promise<string> {
    const enhancedPrompt = this.enhancePromptWithSP(prompt, domain);
    
    try {
      // Use your existing Genkit setup
      const { text } = await ai.generate({
        prompt: enhancedPrompt,
      });
      
      return text;
    } catch (error) {
      console.error('SP Gemini Service Error:', error);
      throw new Error('Failed to generate SP-enhanced response');
    }
  }

  /**
   * Health-specific SP enhancement
   */
  async generateHealthAdvice(healthData: any): Promise<string> {
    const prompt = `Analyze this health data and provide comprehensive insights with actionable recommendations: ${JSON.stringify(healthData)}`;
    return this.generateSPResponse(prompt, 'health');
  }

  /**
   * Finance-specific SP enhancement
   */
  async generateFinanceAdvice(financeData: any): Promise<string> {
    const prompt = `Analyze this financial data and provide smart money management advice: ${JSON.stringify(financeData)}`;
    return this.generateSPResponse(prompt, 'finance');
  }

  /**
   * Travel planning SP enhancement
   */
  async generateTravelPlan(travelData: any): Promise<string> {
    const prompt = `Create an optimized travel plan based on: ${JSON.stringify(travelData)}`;
    return this.generateSPResponse(prompt, 'travel');
  }

  /**
   * Calendar optimization SP enhancement
   */
  async optimizeSchedule(calendarData: any): Promise<string> {
    const prompt = `Optimize this schedule for maximum productivity and work-life balance: ${JSON.stringify(calendarData)}`;
    return this.generateSPResponse(prompt, 'calendar');
  }
}

export const spGeminiService = new SPGeminiService();
export default SPGeminiService;
