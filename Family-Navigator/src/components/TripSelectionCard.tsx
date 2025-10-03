'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, DollarSign, Clock, Star, MapPin } from 'lucide-react';
import { Trip } from '../lib/trip-types';

interface TripSelectionCardProps {
  trip: Trip;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

function TripSelectionCardComponent({
  trip,
  isSelected,
  onToggle,
  index,
}: TripSelectionCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  const getTripTypeColor = (type: Trip['type']) => {
    const colors = {
      cruise: 'bg-blue-100 text-blue-800',
      flight: 'bg-purple-100 text-purple-800',
      roadtrip: 'bg-green-100 text-green-800',
      hybrid: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-md'
          : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
      }`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${trip.name} for comparison`}
    >
      {/* Selection Indicator */}
      <div className="absolute top-3 right-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'border-indigo-500 bg-indigo-500'
              : 'border-gray-300'
          }`}
        >
          {isSelected && (
            <Check className="w-3 h-3 text-white" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Trip Content */}
      <div className="pr-8">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">{trip.name}</h4>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTripTypeColor(trip.type)}`}
            >
              {trip.type.charAt(0).toUpperCase() + trip.type.slice(1)}
            </span>
          </div>
        </div>

        {/* Trip Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-600">
              ${trip.cost.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-600">
              {trip.duration} days
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-600">
              {trip.rating}/5.0
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span className="text-gray-600">
              Family: {trip.familyFriendly}/10
            </span>
          </div>
        </div>

        {/* Description */}
        {trip.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {trip.description}
          </p>
        )}

        {/* Highlights */}
        {trip.highlights && trip.highlights.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {trip.highlights.slice(0, 3).map((highlight, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {highlight}
                </span>
              ))}
              {trip.highlights.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                  +{trip.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export const TripSelectionCard = memo(TripSelectionCardComponent);
