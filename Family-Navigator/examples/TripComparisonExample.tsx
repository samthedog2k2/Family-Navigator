'use client';

import React, { useState, useEffect } from 'react';
import { Trip } from '../lib/trip-types';
import TripComparison from '../components/TripComparison';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Extended example data with more realistic trip information
const EXAMPLE_TRIPS: Trip[] = [
  {
    id: 'cruise-caribbean',
    name: '7-Day Caribbean Cruise',
    type: 'cruise',
    cost: 4500,
    duration: 7,
    rating: 4.5,
    convenience: 8,
    familyFriendly: 9,
    description: 'Relaxing cruise through the beautiful Caribbean islands with family-friendly activities and all-inclusive dining.',
    imageUrl: '/images/caribbean-cruise.jpg',
    highlights: ['All-inclusive dining', 'Kids club', 'Pool deck', 'Shore excursions', 'Evening entertainment'],
  },
  {
    id: 'orlando-parks',
    name: 'Orlando Theme Parks Adventure',
    type: 'roadtrip',
    cost: 3200,
    duration: 5,
    rating: 4.8,
    convenience: 7,
    familyFriendly: 10,
    description: 'Magic-filled adventure at world-famous theme parks perfect for families with young children.',
    imageUrl: '/images/orlando-parks.jpg',
    highlights: ['Disney World', 'Universal Studios', 'Water parks', 'Character dining', 'FastPass access'],
  },
  {
    id: 'hawaii-adventure',
    name: 'Hawaii Island Adventure',
    type: 'flight',
    cost: 7800,
    duration: 10,
    rating: 4.9,
    convenience: 6,
    familyFriendly: 8,
    description: 'Tropical paradise with stunning beaches, active volcanoes, and rich cultural experiences.',
    imageUrl: '/images/hawaii-adventure.jpg',
    highlights: ['Volcano tours', 'Snorkeling', 'Luau dinner', 'Beach resorts', 'Helicopter tours'],
  },
  {
    id: 'europe-tour',
    name: 'European Capitals Tour',
    type: 'flight',
    cost: 6500,
    duration: 12,
    rating: 4.6,
    convenience: 5,
    familyFriendly: 7,
    description: 'Cultural journey through historic European capitals with guided tours and local experiences.',
    imageUrl: '/images/europe-tour.jpg',
    highlights: ['Historic sites', 'Museums', 'Local cuisine', 'Guided tours', 'Train travel'],
  },
  {
    id: 'national-parks',
    name: 'National Parks Road Trip',
    type: 'roadtrip',
    cost: 2800,
    duration: 8,
    rating: 4.4,
    convenience: 6,
    familyFriendly: 9,
    description: 'Scenic drive through Americas most beautiful national parks with camping and hiking adventures.',
    imageUrl: '/images/national-parks.jpg',
    highlights: ['Camping', 'Hiking trails', 'Wildlife viewing', 'Scenic drives', 'Ranger programs'],
  },
  {
    id: 'alaska-cruise',
    name: 'Alaska Glacier Cruise',
    type: 'cruise',
    cost: 5900,
    duration: 9,
    rating: 4.7,
    convenience: 8,
    familyFriendly: 6,
    description: 'Breathtaking journey through Alaskan fjords with glacier viewing and wildlife spotting.',
    imageUrl: '/images/alaska-cruise.jpg',
    highlights: ['Glacier viewing', 'Wildlife spotting', 'Scenic cruising', 'Educational talks', 'Photography workshops'],
  },
];

export default function TripComparisonExample() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);

  // Simulate loading trips from an API
  useEffect(() => {
    const loadTrips = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate potential error (uncomment to test error handling)
      // if (Math.random() > 0.8) {
      //   throw new Error('Failed to load trip data');
      // }

      setTrips(EXAMPLE_TRIPS);
      setIsLoading(false);
    };

    loadTrips().catch(error => {
      console.error('Failed to load trips:', error);
      setIsLoading(false);
    });
  }, []);

  const handleTripSelection = (tripIds: string[]) => {
    setSelectedTripIds(tripIds);
    console.log('Selected trips:', tripIds);

    // Here you could save selections to local storage, analytics, etc.
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTrips', JSON.stringify(tripIds));
    }
  };

  // Mock family data for backward compatibility
  const mockFamily = {
    members: ['Adam', 'Holly', 'Ethan', 'Elle'],
    preferences: {
      budget: 5000,
      preferredDuration: 7,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Family Trip Comparison Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare different vacation options to find the perfect trip for your family.
            Select multiple trips to see detailed comparisons, costs, and ratings.
          </p>
        </div>

        <ErrorBoundary>
          <TripComparison
            trips={trips}
            family={mockFamily}
            isLoading={isLoading}
            onTripSelect={handleTripSelection}
          />
        </ErrorBoundary>

        {/* Selected Trips Summary */}
        {selectedTripIds.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Selection Summary
            </h3>
            <div className="space-y-2">
              {selectedTripIds.map(tripId => {
                const trip = trips.find(t => t.id === tripId);
                return trip ? (
                  <div key={tripId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{trip.name}</span>
                    <span className="text-indigo-600">${trip.cost.toLocaleString()}</span>
                  </div>
                ) : null;
              })}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Estimated Cost:</span>
                  <span className="text-xl text-indigo-600">
                    ${selectedTripIds
                      .reduce((total, tripId) => {
                        const trip = trips.find(t => t.id === tripId);
                        return total + (trip?.cost || 0);
                      }, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Click on trip cards to select them for comparison</li>
            <li>• Use sorting controls to organize trips by cost, duration, rating, or family score</li>
            <li>• Select 2+ trips to see detailed comparison charts</li>
            <li>• Review the summary metrics to make informed decisions</li>
            <li>• Use keyboard navigation for accessibility (Tab, Enter, Space)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}