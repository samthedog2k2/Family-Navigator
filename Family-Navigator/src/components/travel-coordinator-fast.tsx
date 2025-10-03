/**
 * SP Fast Travel Coordinator - NOW WITH AI INTEGRATION
 * Embodying: Werner Vogels (Performance) + Steve Jobs (UX) + Linus Torvalds (Stability)
 */

'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle, Clock, Ship } from 'lucide-react';

interface TravelCoordinatorFastProps {
  onFindTrip: () => void;
  isProcessing: boolean;
}


export default function TravelCoordinatorFast({ onFindTrip, isProcessing }: TravelCoordinatorFastProps) {
  
  const processingSteps = [
    'Analyzing user preferences...',
    'Engaging Query Analyst Agent...',
    'Engaging Info Retriever Agent...',
    'Scraping live cruise data...',
    'Engaging Data Synthesizer Agent...',
    'Finalizing recommendations...'
  ];
  
  const [currentStep, setCurrentStep] = useState(0);


  return (
    <div className="space-y-8">
      {/* Trip Summary Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <MapPin className="w-6 h-6 mr-3 text-blue-600" />
          Your Caribbean Cruise Adventure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Ship className="w-5 h-5 mr-3 text-blue-500" />
            <div>
              <div className="font-semibold">Caribbean Cruise</div>
              <div className="text-sm text-gray-600">7-night adventure</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Calendar className="w-5 h-5 mr-3 text-green-500" />
            <div>
              <div className="font-semibold">Oct 4-11, 2025</div>
              <div className="text-sm text-gray-600">Perfect timing</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <Users className="w-5 h-5 mr-3 text-purple-500" />
            <div>
              <div className="font-semibold">4 Family Members</div>
              <div className="text-sm text-gray-600">From Greenwood, IN</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="text-center">
        <button
          onClick={onFindTrip}
          disabled={isProcessing}
          className={`px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform ${
            isProcessing
              ? 'bg-gray-300 cursor-not-allowed scale-95'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              Planning Your Trip...
            </span>
          ) : (
            '🤖 Find Perfect Trip with AI'
          )}
        </button>
      </div>

      {/* Processing Animation */}
      {isProcessing && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">AI Travel Planning in Progress</h3>
            <p className="text-gray-600">Our expert agents are finding the best options for you</p>
          </div>
          
          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div key={index} className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                index === currentStep ? 'bg-blue-50 border-l-4 border-blue-500' :
                index < currentStep ? 'bg-green-50 border-l-4 border-green-500' :
                'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  index === currentStep ? 'bg-blue-500 text-white' :
                  index < currentStep ? 'bg-green-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : index === currentStep ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`font-medium ${
                  index === currentStep ? 'text-blue-700' :
                  index < currentStep ? 'text-green-700' :
                  'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
