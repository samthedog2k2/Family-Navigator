'use client';

import React, { useState } from 'react';
import { FamilyData } from '../lib/family-types';
import FamilyProfile from '../components/FamilyProfile';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Example usage of the optimized FamilyProfile component
export default function FamilyProfileExample() {
  const [family, setFamily] = useState<FamilyData>({
    id: 'family-1',
    members: [
      {
        id: 'member-1',
        name: 'Adam',
        age: 35,
        preferences: {},
      },
      {
        id: 'member-2',
        name: 'Holly',
        age: 32,
        preferences: {},
      },
      {
        id: 'member-3',
        name: 'Ethan',
        age: 12,
        preferences: {},
      },
      {
        id: 'member-4',
        name: 'Elle',
        age: 8,
        preferences: {},
      },
    ],
    homeAddress: {
      street: '123 Main Street',
      city: 'Indianapolis',
      state: 'IN',
      zip: '46250',
      country: 'USA'
    },
    defaultAirport: 'IND',
    preferences: {
      carDefaults: {
        year: 2022,
        make: 'Toyota',
        model: 'Highlander',
        mpg: 28,
        fuelType: 'Gasoline',
      },
    },
  });

  const handleFamilyUpdate = async (updatedFamily: FamilyData): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate potential error (uncomment to test error handling)
    // if (Math.random() > 0.8) {
    //   throw new Error('Failed to save family profile');
    // }

    setFamily(updatedFamily);
    console.log('Family profile updated:', updatedFamily);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Family Profile Management
      </h1>

      <ErrorBoundary>
        <FamilyProfile
          family={family}
          onFamilyUpdate={handleFamilyUpdate}
        />
      </ErrorBoundary>
    </div>
  );
}
