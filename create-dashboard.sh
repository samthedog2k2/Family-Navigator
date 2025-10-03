#!/bin/bash

echo "🔧 Creating missing TravelDashboard component..."

cat > src/components/TravelDashboard.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign, Search, Sparkles, Clock, Ship, Plane, Car, Globe } from 'lucide-react';
import { FamilyData, TripRequest } from '../lib/travel-types';

interface TravelDashboardProps {
  family: FamilyData;
  onTripRequest: (request: TripRequest) => void;
  isProcessing: boolean;
}

export default function TravelDashboard({ family, onTripRequest, isProcessing }: TravelDashboardProps) {
  const [tripType, setTripType] = useState<'cruise' | 'flight' | 'roadtrip' | 'hybrid'>('cruise');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinations, setDestinations] = useState<string[]>(['Caribbean']);
  const [budget, setBudget] = useState(5000);
  const [interests, setInterests] = useState<string[]>(['family', 'relaxation']);

  const handleSubmit = () => {
    const request: TripRequest = {
      type: tripType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      origin: family.homeAddress.city,
      destinations,
      budget: {
        total: budget,
        flexibility: 'flexible',
      },
      interests,
    };
    onTripRequest(request);
  };

  const tripTypes = [
    { id: 'cruise', label: 'Cruise', icon: Ship },
    { id: 'flight', label: 'Flight', icon: Plane },
    { id: 'roadtrip', label: 'Road Trip', icon: Car },
    { id: 'hybrid', label: 'Combined', icon: Globe },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Plan Your Trip</h2>
        <Sparkles className="w-6 h-6 text-indigo-500" />
      </div>

      {/* Trip Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Trip Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tripTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTripType(type.id as any)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
                  tripType === type.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-sm font-medium">{type.label}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Destinations */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Destinations
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {destinations.map((dest, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              {dest}
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add destination and press Enter..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const input = e.currentTarget;
              if (input.value) {
                setDestinations([...destinations, input.value]);
                input.value = '';
              }
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Budget */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline w-4 h-4 mr-1" />
          Budget: ${budget.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="25000"
          step="500"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$1,000</span>
          <span>$25,000</span>
        </div>
      </div>

      {/* Family Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Traveling with {family.members.length} family members
            </span>
          </div>
          <div className="text-sm text-gray-600">
            From: {family.homeAddress.city}, {family.homeAddress.state}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={isProcessing || !startDate || !endDate}
        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
          isProcessing || !startDate || !endDate
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
        }`}
      >
        {isProcessing ? (
          <>
            <Clock className="w-5 h-5 animate-spin" />
            <span>Processing with AI Agents...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Find Perfect Trip</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
EOF

echo "✅ TravelDashboard.tsx created"
echo ""
echo "Now clearing cache and restarting..."
rm -rf .next
echo ""
echo "Run: npm run dev"
