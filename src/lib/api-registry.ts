/**
 * API Registry Utility
 *
 * Helper functions for agents to discover and use free APIs
 */

import freeApisData from '@/data/free-apis.json';

export interface FreeAPI {
  name: string;
  url: string;
  category?: string;
  requires_key: boolean;
  free_tier?: string;
  description: string;
  docs: string;
  status: string;
}

/**
 * Get all APIs from the registry
 */
export function getAllApis(): FreeAPI[] {
  const apis: FreeAPI[] = [];

  for (const [category, categoryApis] of Object.entries(freeApisData)) {
    for (const api of categoryApis as any[]) {
      apis.push({
        ...api,
        category,
      });
    }
  }

  return apis;
}

/**
 * Get APIs by category
 */
export function getApisByCategory(category: string): FreeAPI[] {
  const categoryData = freeApisData[category as keyof typeof freeApisData];
  if (!categoryData) return [];

  return categoryData.map(api => ({
    ...api,
    category,
  }));
}

/**
 * Get a specific API by name
 */
export function getApiByName(name: string): FreeAPI | null {
  const allApis = getAllApis();
  return allApis.find(api => api.name.toLowerCase() === name.toLowerCase()) || null;
}

/**
 * Get APIs that don't require a key
 */
export function getNoKeyApis(): FreeAPI[] {
  return getAllApis().filter(api => !api.requires_key);
}

/**
 * Get active APIs (currently being used in the app)
 */
export function getActiveApis(): FreeAPI[] {
  return getAllApis().filter(api => api.status === 'active');
}

/**
 * Search APIs by query
 */
export function searchApis(query: string): FreeAPI[] {
  const lowerQuery = query.toLowerCase();
  return getAllApis().filter(
    api =>
      api.name.toLowerCase().includes(lowerQuery) ||
      api.description.toLowerCase().includes(lowerQuery) ||
      api.category?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get API statistics
 */
export function getApiStats() {
  const allApis = getAllApis();
  const categories = Object.keys(freeApisData);

  return {
    total: allApis.length,
    categories: categories.length,
    byCategory: categories.reduce((acc: any, cat) => {
      acc[cat] = getApisByCategory(cat).length;
      return acc;
    }, {}),
    noKeyRequired: allApis.filter(api => !api.requires_key).length,
    keyRequired: allApis.filter(api => api.requires_key).length,
    active: allApis.filter(api => api.status === 'active').length,
  };
}

/**
 * Get recommended APIs for a specific agent
 */
export function getRecommendedApisForAgent(agentType: string): FreeAPI[] {
  const recommendations: { [key: string]: string[] } = {
    'cruise': ['weather', 'transportation'],
    'flight': ['transportation', 'weather'],
    'hotel': ['transportation', 'maps'],
    'roadtrip': ['maps', 'transportation', 'weather'],
    'weather': ['weather'],
    'expense': ['finance'],
    'activity': ['maps', 'transportation'],
    'restaurant': ['maps'],
    'deal': ['finance'],
  };

  const categories = recommendations[agentType] || [];
  const apis: FreeAPI[] = [];

  for (const category of categories) {
    apis.push(...getApisByCategory(category));
  }

  return apis;
}

/**
 * Check if an API is available (key configured if needed)
 */
export function isApiAvailable(apiName: string): boolean {
  const api = getApiByName(apiName);
  if (!api) return false;

  // If no key required, it's available
  if (!api.requires_key) return true;

  // Check if key is configured in environment
  // This is a placeholder - you'd check process.env for actual keys
  const envKeyName = `${apiName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY`;
  return typeof process !== 'undefined' && !!process.env?.[envKeyName];
}

/**
 * Get API endpoint URL
 */
export function getApiUrl(apiName: string): string | null {
  const api = getApiByName(apiName);
  return api?.url || null;
}

/**
 * Get API documentation URL
 */
export function getApiDocs(apiName: string): string | null {
  const api = getApiByName(apiName);
  return api?.docs || null;
}

/**
 * Get categories
 */
export function getCategories(): string[] {
  return Object.keys(freeApisData);
}

/**
 * Example usage for agents:
 *
 * import { getApisByCategory, getNoKeyApis, isApiAvailable } from '@/lib/api-registry';
 *
 * // Get all weather APIs
 * const weatherApis = getApisByCategory('weather');
 *
 * // Get APIs that don't need keys
 * const noKeyApis = getNoKeyApis();
 *
 * // Check if Open-Meteo is available
 * if (isApiAvailable('Open-Meteo')) {
 *   // Use the API
 * }
 */
