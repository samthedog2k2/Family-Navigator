'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Shield,
  CheckCircle2,
  XCircle,
  BarChart3,
  Radar,
  SortAsc,
  SortDesc,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TripComparisonProps, Trip, TripMetric } from '../lib/trip-types';
import { useTripComparison } from '../hooks/useTripComparison';
import { TripSelectionCard } from './TripSelectionCard';
import { CostComparisonChart } from './charts/CostComparisonChart';
import { RadarComparisonChart } from './charts/RadarComparisonChart';

// Default trips data for backward compatibility
const DEFAULT_TRIPS: Trip[] = [
  {
    id: 'trip1',
    name: '7-Day Caribbean Cruise',
    type: 'cruise',
    cost: 4500,
    duration: 7,
    rating: 4.5,
    convenience: 8,
    familyFriendly: 9,
    description: 'Relaxing cruise through the beautiful Caribbean islands with family-friendly activities.',
    highlights: ['All-inclusive dining', 'Kids club', 'Pool deck', 'Shore excursions'],
  },
  {
    id: 'trip2',
    name: 'Orlando Theme Parks',
    type: 'roadtrip',
    cost: 3200,
    duration: 5,
    rating: 4.8,
    convenience: 7,
    familyFriendly: 10,
    description: 'Magic-filled adventure at world-famous theme parks perfect for families.',
    highlights: ['Disney World', 'Universal Studios', 'Water parks', 'Character dining'],
  },
  {
    id: 'trip3',
    name: 'Hawaii Adventure',
    type: 'flight',
    cost: 7800,
    duration: 10,
    rating: 4.9,
    convenience: 6,
    familyFriendly: 8,
    description: 'Tropical paradise with stunning beaches, volcanoes, and cultural experiences.',
    highlights: ['Volcano tours', 'Snorkeling', 'Luau dinner', 'Beach resorts'],
  },
];

export default function TripComparison({
  trips = DEFAULT_TRIPS,
  family,
  isLoading: externalLoading = false,
  onTripSelect
}: TripComparisonProps) {
  const {
    state,
    selectedTripData,
    sortedTrips,
    chartData,
    radarData,
    comparisonMetrics,
    hasSelection,
    canCompare,
    actions: {
      toggleTripSelection,
      selectAllTrips,
      clearSelection,
      setSorting,
      setError,
    },
  } = useTripComparison(trips, onTripSelect);

  const metrics: TripMetric[] = useMemo(() => [
    {
      icon: DollarSign,
      label: 'Total Cost',
      getValue: (trip: Trip) => `$${trip.cost.toLocaleString()}`
    },
    {
      icon: Clock,
      label: 'Duration',
      getValue: (trip: Trip) => `${trip.duration} days`
    },
    {
      icon: Star,
      label: 'Rating',
      getValue: (trip: Trip) => `${trip.rating}/5.0`
    },
    {
      icon: Shield,
      label: 'Insurance',
      getValue: (trip: Trip) => `$${Math.round(trip.cost * 0.07).toLocaleString()}`
    },
  ], []);

  const isLoading = externalLoading || state.isLoading;

  if (state.error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Trips</h3>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Trip Comparison</h2>
          <div className="flex items-center space-x-3">
            {hasSelection && (
              <span className="text-sm text-gray-600">
                {state.selectedTrips.length} trip{state.selectedTrips.length !== 1 ? 's' : ''} selected
              </span>
            )}
            {trips.length > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={selectAllTrips}
                  className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  aria-label="Select all trips"
                >
                  Select All
                </button>
                {hasSelection && (
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                    aria-label="Clear selection"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          {(['cost', 'duration', 'rating', 'familyFriendly'] as const).map((sortKey) => (
            <button
              key={sortKey}
              onClick={() => setSorting(sortKey)}
              className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
                state.sortBy === sortKey
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={`Sort by ${sortKey}`}
            >
              <span className="capitalize">{sortKey === 'familyFriendly' ? 'Family Score' : sortKey}</span>
              {state.sortBy === sortKey && (
                state.sortOrder === 'asc' ? (
                  <SortAsc className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <SortDesc className="w-3 h-3" aria-hidden="true" />
                )
              )}
            </button>
          ))}
        </div>

        {/* Trip Selection Grid */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            role="group"
            aria-label="Trip selection"
          >
            {sortedTrips.map((trip, index) => (
              <TripSelectionCard
                key={trip.id}
                trip={trip}
                isSelected={state.selectedTrips.includes(trip.id)}
                onToggle={() => toggleTripSelection(trip.id)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {trips.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Trips Available</h3>
            <p className="text-gray-600">Add some trips to start comparing options.</p>
          </div>
        )}
      </div>

      {/* Comparison Charts - Only show when trips are selected */}
      <AnimatePresence>
        {canCompare && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Cost Comparison Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Cost Breakdown</h3>
              </div>
              <CostComparisonChart data={chartData} />
            </div>

            {/* Radar Chart Comparison */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Radar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Overall Comparison</h3>
              </div>
              <RadarComparisonChart data={radarData} />
            </div>

            {/* Metrics Comparison */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Comparison</h3>
              <div className="space-y-4">
                {metrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                        <span className="font-medium text-gray-700">{metric.label}</span>
                      </div>
                      <div className="flex space-x-6">
                        {selectedTripData.map((trip, tripIdx) => (
                          <div key={tripIdx} className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {metric.getValue(trip)}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-20">
                              {trip.name.split(' ')[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Metrics */}
            {comparisonMetrics && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Average Cost</div>
                    <div className="text-lg font-bold text-blue-900">
                      ${Math.round(comparisonMetrics.averageCost).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Total Duration</div>
                    <div className="text-lg font-bold text-green-900">
                      {comparisonMetrics.totalDuration} days
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Average Rating</div>
                    <div className="text-lg font-bold text-purple-900">
                      {comparisonMetrics.averageRating.toFixed(1)}/5.0
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm text-orange-600 font-medium">Best Value</div>
                    <div className="text-lg font-bold text-orange-900 truncate">
                      {comparisonMetrics.bestValue.name.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt to Select Trips */}
      {hasSelection && !canCompare && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-800">Select More Trips</h4>
              <p className="text-sm text-yellow-700">
                Select at least 2 trips to see detailed comparisons and charts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}