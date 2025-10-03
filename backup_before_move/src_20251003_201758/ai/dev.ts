
import { config } from 'dotenv';
config();

import '@/ai/flows/retirement-college-projections.ts';
import '@/ai/flows/smart-finance-summaries.ts';
import '@/ai/flows/website-integration-rag.ts';
import '@/ai/flows/travel-recommendations.ts';
import '@/ai/flows/chat.ts';
import '@/ai/flows/weather.ts';
import '@/ai/flows/cruise-search.ts';
import '@/ai/flows/entertainment-recommendations.ts';
import '@/ai/flows/secure-website-agent.ts';

// Register the new autonomous agent and its sub-agents
import '@/ai/agents/cruise-coordinator/agent.ts';
import '@/ai/agents/cruise-coordinator/query-analyst.ts';
import '@/ai/agents/cruise-coordinator/info-retriever.ts';
import '@/ai/agents/cruise-coordinator/data-synthesizer.ts';
