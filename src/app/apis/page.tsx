'use client';

/**
 * Free APIs Directory Page
 *
 * Browse, search, and explore 150+ free APIs for travel, weather,
 * health, finance, maps, and more.
 */

import { useState, useEffect } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ExternalLink, Key, Globe, Filter, CheckCircle2 } from 'lucide-react';

interface FreeAPI {
  name: string;
  url: string;
  category: string;
  requires_key: boolean;
  free_tier?: string;
  description: string;
  docs: string;
  status: string;
}

interface ApiStats {
  total: number;
  filtered: number;
  categories: number;
  byCategory: { [key: string]: number };
  noKeyRequired: number;
  keyRequired: number;
  active: number;
}

export default function ApisPage() {
  const [apis, setApis] = useState<FreeAPI[]>([]);
  const [filteredApis, setFilteredApis] = useState<FreeAPI[]>([]);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterKeyRequired, setFilterKeyRequired] = useState<'all' | 'true' | 'false'>('all');

  // Fetch APIs on mount
  useEffect(() => {
    fetchApis();
  }, []);

  // Filter APIs when filters change
  useEffect(() => {
    filterApis();
  }, [searchQuery, selectedCategory, filterKeyRequired, apis]);

  async function fetchApis() {
    try {
      const response = await fetch('/api/free-apis');
      const data = await response.json();

      if (data.success) {
        setApis(data.apis);
        setFilteredApis(data.apis);
        setStats(data.stats);
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch APIs:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterApis() {
    let filtered = [...apis];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        api =>
          api.name.toLowerCase().includes(query) ||
          api.description.toLowerCase().includes(query) ||
          api.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(api => api.category === selectedCategory);
    }

    // Filter by key requirement
    if (filterKeyRequired !== 'all') {
      const requiresKey = filterKeyRequired === 'true';
      filtered = filtered.filter(api => api.requires_key === requiresKey);
    }

    setFilteredApis(filtered);
  }

  function resetFilters() {
    setSearchQuery('');
    setSelectedCategory('all');
    setFilterKeyRequired('all');
  }

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading API registry...</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <PageHeader
        title="Free API Directory"
        description={`Browse ${stats?.total || 0} free APIs for travel, weather, health, finance, and more`}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-sm text-muted-foreground">Total APIs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats?.noKeyRequired || 0}</div>
            <p className="text-sm text-muted-foreground">No Key Required</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats?.categories || 0}</div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats?.active || 0}</div>
            <p className="text-sm text-muted-foreground">Already Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({stats?.byCategory[cat] || 0})
                </option>
              ))}
            </select>

            {/* Key Requirement Filter */}
            <select
              value={filterKeyRequired}
              onChange={(e) => setFilterKeyRequired(e.target.value as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All APIs</option>
              <option value="false">No Key Required ({stats?.noKeyRequired})</option>
              <option value="true">Key Required ({stats?.keyRequired})</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== 'all' || filterKeyRequired !== 'all') && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">Search: {searchQuery}</Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary">Category: {selectedCategory}</Badge>
              )}
              {filterKeyRequired !== 'all' && (
                <Badge variant="secondary">
                  {filterKeyRequired === 'true' ? 'Key Required' : 'No Key Required'}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-auto"
              >
                Clear All
              </Button>
            </div>
          )}

          <div className="mt-2 text-sm text-muted-foreground">
            Showing {filteredApis.length} of {stats?.total} APIs
          </div>
        </CardContent>
      </Card>

      {/* APIs by Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 7).map(cat => (
            <TabsTrigger key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ApiGrid apis={filteredApis} />
        </TabsContent>

        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-6">
            <ApiGrid apis={filteredApis.filter(api => api.category === cat)} />
          </TabsContent>
        ))}
      </Tabs>
    </LayoutWrapper>
  );
}

/**
 * API Grid Component
 */
function ApiGrid({ apis }: { apis: FreeAPI[] }) {
  if (apis.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No APIs found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {apis.map((api, index) => (
        <ApiCard key={index} api={api} />
      ))}
    </div>
  );
}

/**
 * API Card Component
 */
function ApiCard({ api }: { api: FreeAPI }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {api.name}
              {api.status === 'active' && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </CardTitle>
            <CardDescription className="mt-2">{api.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {api.category}
            </Badge>
            {api.requires_key ? (
              <Badge variant="secondary">
                <Key className="w-3 h-3 mr-1" />
                Key Required
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-600">
                <Globe className="w-3 h-3 mr-1" />
                No Key
              </Badge>
            )}
            {api.status === 'active' && (
              <Badge variant="default" className="bg-blue-600">
                Active
              </Badge>
            )}
          </div>

          {/* Free Tier Info */}
          {api.free_tier && (
            <p className="text-sm text-muted-foreground">
              <strong>Free tier:</strong> {api.free_tier}
            </p>
          )}

          {/* Links */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(api.docs, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Docs
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(api.url, '_blank')}
            >
              <Globe className="w-3 h-3 mr-1" />
              API
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
