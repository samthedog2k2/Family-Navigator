/**
 * Free APIs Registry Endpoint
 *
 * GET /api/free-apis - Returns all free APIs
 * GET /api/free-apis?category=weather - Filter by category
 * GET /api/free-apis?requires_key=false - Filter by key requirement
 */

import { NextRequest, NextResponse } from 'next/server';
import freeApisData from '@/data/free-apis.json';

// In-memory cache (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
let cachedData: any = null;
let cacheTimestamp = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const requiresKeyParam = searchParams.get('requires_key');
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();

    // Check cache
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      return filterAndReturn(cachedData, category, requiresKeyParam, status, search);
    }

    // Build API registry from JSON data
    const apiRegistry: any[] = [];

    for (const [categoryName, apis] of Object.entries(freeApisData)) {
      for (const api of apis as any[]) {
        apiRegistry.push({
          ...api,
          category: categoryName,
        });
      }
    }

    // Update cache
    cachedData = apiRegistry;
    cacheTimestamp = now;

    return filterAndReturn(apiRegistry, category, requiresKeyParam, status, search);

  } catch (error: any) {
    console.error('Error in /api/free-apis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API registry', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Filter and return APIs based on query parameters
 */
function filterAndReturn(
  apis: any[],
  category: string | null,
  requiresKeyParam: string | null,
  status: string | null,
  search: string | null
) {
  let filtered = [...apis];

  // Filter by category
  if (category) {
    filtered = filtered.filter(api => api.category === category);
  }

  // Filter by key requirement
  if (requiresKeyParam !== null) {
    const requiresKey = requiresKeyParam === 'true';
    filtered = filtered.filter(api => api.requires_key === requiresKey);
  }

  // Filter by status
  if (status) {
    filtered = filtered.filter(api => api.status === status);
  }

  // Search by name or description
  if (search) {
    filtered = filtered.filter(api =>
      api.name.toLowerCase().includes(search) ||
      api.description?.toLowerCase().includes(search)
    );
  }

  // Get unique categories
  const categories = [...new Set(apis.map(api => api.category))];

  // Statistics
  const stats = {
    total: apis.length,
    filtered: filtered.length,
    categories: categories.length,
    byCategory: categories.reduce((acc: any, cat) => {
      acc[cat] = apis.filter(api => api.category === cat).length;
      return acc;
    }, {}),
    noKeyRequired: apis.filter(api => !api.requires_key).length,
    keyRequired: apis.filter(api => api.requires_key).length,
    active: apis.filter(api => api.status === 'active').length,
  };

  return NextResponse.json({
    success: true,
    stats,
    categories,
    apis: filtered,
    cached: true,
  });
}
