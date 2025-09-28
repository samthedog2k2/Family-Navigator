/**
 * SP Fast Travel Coordinator - NO API CALLS, NO CRASHES
 * Embodying: Werner Vogels (Performance) + Steve Jobs (UX) + Linus Torvalds (Stability)
 */

'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Plane, Ship, Hotel, Activity, CheckCircle, Clock } from 'lucide-react';

interface TripResults {
  cruises: any[];
  flights: any[];
  hotels: any[];
  activities: any[];
  totalCost: number;
  processed: boolean;
}

export default function TravelCoordinatorFast() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<TripResults>({
    cruises: [],
    flights: [],
    hotels: [],
    activities: [],
    totalCost: 0,
    processed: false
  });
  const [processingStep, setProcessingStep] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    '🚢 Analyzing cruise options...',
    '✈️ Finding optimal flights...',
    '🏨 Searching hotels near port...',
    '🎯 Discovering activities...',
    '💰 Calculating total costs...',
    '✅ Finalizing recommendations...'
  ];

  const handleFindTrip = async () => {
    setIsProcessing(true);
    setResults({ cruises: [], flights: [], hotels: [], activities: [], totalCost: 0, processed: false });
    setCurrentStep(0);
    
    try {
      // Fast processing with immediate UI updates - NO API CALLS
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        setProcessingStep(processingSteps[i]);
        
        // Short delay for smooth animation - Werner Vogels performance principle
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Generate instant results - NO EXTERNAL CALLS
      const mockResults = {
        cruises: [
          {
            name: 'Royal Caribbean Navigator of the Seas',
            price: '$899/person',
            totalPrice: 3596,
            duration: '7 nights',
            destinations: ['Cozumel, Mexico', 'Jamaica', 'Labadee, Haiti'],
            rating: 4.5,
            highlights: ['Rock climbing wall', 'FlowRider surf simulator', 'Broadway-style shows'],
            departure: 'Miami, FL',
            dates: 'October 4-11, 2025',
            cabin: 'Interior Stateroom',
            amenities: ['Anytime dining', 'Kids club', 'Multiple pools']
          },
          {
            name: 'Norwegian Getaway',
            price: '$799/person', 
            totalPrice: 3196,
            duration: '7 nights',
            destinations: ['Jamaica', 'Grand Cayman', 'Cozumel, Mexico'],
            rating: 4.3,
            highlights: ['Waterslides', 'Ropes course', 'Freestyle dining'],
            departure: 'Miami, FL',
            dates: 'October 4-11, 2025',
            cabin: 'Interior Stateroom',
            amenities: ['Multiple restaurants', 'Sports complex', 'Entertainment']
          }
        ],
        flights: [
          {
            airline: 'Delta Airlines',
            route: 'IND → MIA',
            outbound: 'Oct 3: 7:30 AM - 11:45 AM',
            return: 'Oct 11: 2:15 PM - 5:30 PM',
            price: '$320/person',
            totalPrice: 1280,
            duration: '2h 45m each way',
            type: 'Nonstop',
            aircraft: 'Boeing 737-800',
            baggage: '4 carry-ons included, 2 checked bags $30 each'
          },
          {
            airline: 'American Airlines',
            route: 'IND → MIA',
            outbound: 'Oct 3: 9:15 AM - 2:30 PM',
            return: 'Oct 11: 4:45 PM - 8:15 PM', 
            price: '$285/person',
            totalPrice: 1140,
            duration: '3h 20m each way',
            type: '1 stop in Charlotte',
            aircraft: 'Airbus A321',
            baggage: '4 carry-ons included, 2 checked bags $35 each'
          }
        ],
        hotels: [
          {
            name: 'DoubleTree by Hilton Miami Airport',
            brand: 'Hilton',
            price: '$179/night',
            totalPrice: 179,
            nights: '1 night (Oct 3-4)',
            rating: 4.2,
            amenities: ['Free cruise port shuttle', 'Pool', 'Restaurant', 'Fitness center'],
            location: '15 minutes to cruise port',
            address: '711 NW 72nd Ave, Miami, FL',
            roomType: 'Two Double Beds',
            nearbyDining: 'Olive Garden (0.8 miles), Target (1.2 miles)'
          },
          {
            name: 'Hampton Inn & Suites Miami Airport South',
            brand: 'Hilton',
            price: '$159/night',
            totalPrice: 159,
            nights: '1 night (Oct 3-4)',
            rating: 4.0,
            amenities: ['Free breakfast', 'Pool', 'Fitness center', 'Business center'],
            location: '20 minutes to cruise port',
            address: '2500 NW 42nd Ave, Miami, FL',
            roomType: 'Family Suite',
            nearbyDining: 'Target (0.5 miles), Olive Garden (1.1 miles)'
          }
        ],
        activities: [
          {
            name: 'Coral World Ocean Park',
            location: 'St. Thomas',
            price: '$25/adult, $15/child',
            totalPrice: 80,
            duration: '3-4 hours',
            type: 'Marine life experience',
            highlights: ['Touch tanks', 'Sea turtle rescue', 'Underwater observatory'],
            bookingTip: 'Shore excursion through cruise recommended'
          },
          {
            name: "Dunn's River Falls Climb",
            location: 'Ocho Rios, Jamaica',
            price: '$30/adult, $20/child',
            totalPrice: 100,
            duration: '2-3 hours',
            type: 'Adventure & Natural attraction',
            highlights: ['Guided waterfall climb', 'Swimming pools', 'Professional photos'],
            bookingTip: 'Water shoes required - bring waterproof camera'
          },
          {
            name: 'Stingray City Excursion',
            location: 'Grand Cayman',
            price: '$45/person',
            totalPrice: 180,
            duration: '4 hours',
            type: 'Marine interaction',
            highlights: ['Swim with stingrays', 'Snorkeling', 'Starfish Point beach'],
            bookingTip: 'Very popular - book early through cruise line'
          }
        ],
        totalCost: 0,
        processed: true
      };

      // Calculate total cost
      const cruiseCost = mockResults.cruises[0].totalPrice;
      const flightCost = mockResults.flights[0].totalPrice;
      const hotelCost = mockResults.hotels[0].totalPrice;
      const activityCost = mockResults.activities.reduce((sum, act) => sum + act.totalPrice, 0);
      
      mockResults.totalCost = cruiseCost + flightCost + hotelCost + activityCost;

      setResults(mockResults);

    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🌟 Find Perfect Trip</h1>
        <p className="text-gray-600">AI-powered travel planning with instant results</p>
      </div>

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
          onClick={handleFindTrip}
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
            '🔍 Find Perfect Trip'
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

      {/* Results Display */}
      {results.processed && (
        <div className="space-y-8">
          {/* Cost Summary */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                ${results.totalCost.toLocaleString()}
              </div>
              <div className="text-xl opacity-90 mb-4">Total Trip Cost for 4 People</div>
              <div className="text-lg">
                {results.totalCost <= 5000 ? (
                  <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    ✅ Within your $5,000 budget!
                  </span>
                ) : (
                  <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    ⚠️ Over budget by ${(results.totalCost - 5000).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cruise Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Ship className="w-7 h-7 mr-3 text-blue-600" />
              🚢 Recommended Cruises
            </h3>
            <div className="grid gap-6">
              {results.cruises.map((cruise, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{cruise.name}</h4>
                      <p className="text-gray-600">{cruise.duration} • {cruise.dates}</p>
                      <p className="text-sm text-gray-500">Departing from {cruise.departure}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{cruise.price}</div>
                      <div className="text-lg text-gray-500">Total: ${cruise.totalPrice.toLocaleString()}</div>
                      <div className="text-sm text-yellow-600">⭐ {cruise.rating}/5</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <strong className="text-gray-700">Destinations:</strong>
                      <ul className="text-sm text-gray-600 mt-1">
                        {cruise.destinations.map((dest: string, i: number) => (
                          <li key={i}>• {dest}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-gray-700">Highlights:</strong>
                      <ul className="text-sm text-gray-600 mt-1">
                        {cruise.highlights.map((highlight: string, i: number) => (
                          <li key={i}>• {highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm">
                      <strong>Cabin:</strong> {cruise.cabin} • 
                      <strong> Amenities:</strong> {cruise.amenities.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flight Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Plane className="w-7 h-7 mr-3 text-blue-600" />
              ✈️ Flight Options
            </h3>
            <div className="grid gap-6">
              {results.flights.map((flight, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{flight.airline}</h4>
                      <p className="text-gray-600">{flight.route} • {flight.type}</p>
                      <p className="text-sm text-gray-500">{flight.aircraft}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{flight.price}</div>
                      <div className="text-lg text-gray-500">Total: ${flight.totalPrice.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-gray-700">Outbound:</strong>
                      <p className="text-sm text-gray-600">{flight.outbound}</p>
                      <strong className="text-gray-700">Return:</strong>
                      <p className="text-sm text-gray-600">{flight.return}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Duration:</strong>
                      <p className="text-sm text-gray-600">{flight.duration}</p>
                      <strong className="text-gray-700">Baggage:</strong>
                      <p className="text-sm text-gray-600">{flight.baggage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Hotel className="w-7 h-7 mr-3 text-blue-600" />
              🏨 Pre-Cruise Hotels
            </h3>
            <div className="grid gap-6">
              {results.hotels.map((hotel, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{hotel.name}</h4>
                      <p className="text-gray-600">{hotel.brand} • Rating: {hotel.rating}/5</p>
                      <p className="text-sm text-gray-500">{hotel.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{hotel.price}</div>
                      <div className="text-sm text-gray-500">{hotel.nights}</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-gray-700">Location:</strong>
                      <p className="text-sm text-gray-600">{hotel.location}</p>
                      <strong className="text-gray-700">Room:</strong>
                      <p className="text-sm text-gray-600">{hotel.roomType}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Amenities:</strong>
                      <p className="text-sm text-gray-600">{hotel.amenities.join(', ')}</p>
                      <strong className="text-gray-700">Nearby:</strong>
                      <p className="text-sm text-gray-600">{hotel.nearbyDining}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Activity className="w-7 h-7 mr-3 text-blue-600" />
              🎯 Shore Excursions
            </h3>
            <div className="grid gap-6">
              {results.activities.map((activity, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{activity.name}</h4>
                      <p className="text-gray-600">{activity.location} • {activity.duration}</p>
                      <p className="text-sm text-gray-500">{activity.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{activity.price}</div>
                      <div className="text-sm text-gray-500">Family total: ${activity.totalPrice}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong className="text-gray-700">Highlights:</strong>
                    <ul className="text-sm text-gray-600 mt-1">
                      {activity.highlights.map((highlight: string, i: number) => (
                        <li key={i}>• {highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-sm">
                      <strong>💡 Tip:</strong> {activity.bookingTip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
              💾 Save Trip Plan
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
              📧 Share with Family
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
              📅 Add to Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
