/**
 * SP Enhanced Travel Coordinator
 * Embodying: Steve Jobs (Intuitive Design) + Dan Abramov (React Excellence) + Doug Stevenson (Firebase)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign, Plane, Ship, Car, Hotel, Activity } from 'lucide-react';

interface TripPlan {
  id: string;
  type: 'cruise' | 'flight' | 'road-trip' | 'combined';
  destination: string[];
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  from: string;
  recommendations: {
    accommodations: any[];
    activities: any[];
    transportation: any[];
    dining: any[];
    totalCost: number;
    highlights: string[];
  };
  aiAgents: {
    cruiseSpecialist?: any;
    flightExpert?: any;
    hotelFinder?: any;
    roadTripPlanner?: any;
    weatherMonitor?: any;
    expenseTracker?: any;
    insuranceAdvisor?: any;
    activityScout?: any;
  };
}

interface AIAgent {
  name: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  icon: React.ReactNode;
  results?: any;
  progress: number;
}

export default function TravelCoordinatorEnhanced() {
  // State Management (Dan Abramov best practices)
  const [tripData, setTripData] = useState({
    type: 'cruise',
    destinations: ['Caribbean'],
    startDate: '10/04/2025',
    endDate: '10/11/2025',
    budget: 5000,
    travelers: 4,
    from: 'Greenwood, Indiana'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [aiAgents, setAiAgents] = useState<Record<string, AIAgent>>({
    cruiseSpecialist: {
      name: 'Cruise Specialist',
      status: 'idle',
      icon: <Ship className="w-5 h-5" />,
      progress: 0
    },
    flightExpert: {
      name: 'Flight Expert',
      status: 'idle',
      icon: <Plane className="w-5 h-5" />,
      progress: 0
    },
    hotelFinder: {
      name: 'Hotel Finder',
      status: 'idle',
      icon: <Hotel className="w-5 h-5" />,
      progress: 0
    },
    activityScout: {
      name: 'Activity Scout',
      status: 'idle',
      icon: <Activity className="w-5 h-5" />,
      progress: 0
    }
  });

  // AI Agent Processing (Geoffrey Hinton + OpenAI methodology)
  const processWithAIAgents = async () => {
    setIsProcessing(true);
    setTripPlan(null);

    try {
      // Sequential AI agent processing with UI updates
      const agentSequence = ['cruiseSpecialist', 'flightExpert', 'hotelFinder', 'activityScout'];
      const results: any = {};

      for (const agentKey of agentSequence) {
        // Update agent status to processing
        setAiAgents(prev => ({
          ...prev,
          [agentKey]: { ...prev[agentKey], status: 'processing', progress: 0 }
        }));

        // Simulate progressive processing
        for (let progress = 0; progress <= 100; progress += 20) {
          setAiAgents(prev => ({
            ...prev,
            [agentKey]: { ...prev[agentKey], progress }
          }));
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Process with AI agent
        const agentResult = await processIndividualAgent(agentKey, tripData);
        results[agentKey] = agentResult;

        // Update agent status to complete
        setAiAgents(prev => ({
          ...prev,
          [agentKey]: { ...prev[agentKey], status: 'complete', progress: 100, results: agentResult }
        }));
      }

      // Generate comprehensive trip plan
      const finalPlan = await generateComprehensivePlan(tripData, results);
      setTripPlan(finalPlan);

    } catch (error) {
      console.error('AI Agent processing failed:', error);
      // Update all agents to error status
      setAiAgents(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = { ...updated[key], status: 'error' };
        });
        return updated;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Individual AI Agent Processing
  const processIndividualAgent = async (agentType: string, data: any) => {
    // Steve Jobs principle: "Simplicity is the ultimate sophistication"
    switch (agentType) {
      case 'cruiseSpecialist':
        return {
          cruiseLines: [
            {
              name: 'Royal Caribbean Navigator of the Seas',
              price: '$899/person',
              duration: '7 nights',
              destinations: ['Cozumel', 'Jamaica', 'Haiti'],
              amenities: ['Rock climbing', 'Mini golf', 'Broadway shows'],
              rating: 4.5
            },
            {
              name: 'Norwegian Getaway',
              price: '$799/person',
              duration: '7 nights',
              destinations: ['Jamaica', 'Grand Cayman', 'Cozumel'],
              amenities: ['Waterslides', 'Ropes course', 'Multiple dining'],
              rating: 4.3
            }
          ],
          ports: ['Miami', 'Fort Lauderdale'],
          bestTime: 'October is ideal - less crowded, great weather'
        };

      case 'flightExpert':
        return {
          flights: [
            {
              airline: 'Delta',
              route: 'IND → MIA',
              price: '$320/person',
              duration: '2h 45m',
              stops: 'Nonstop'
            },
            {
              airline: 'American',
              route: 'IND → FLL',
              price: '$285/person',
              duration: '3h 20m',
              stops: '1 stop in Charlotte'
            }
          ],
          tips: 'Book 6-8 weeks ahead for best prices'
        };

      case 'hotelFinder':
        return {
          prePost: [
            {
              hotel: 'DoubleTree by Hilton Miami Airport',
              price: '$179/night',
              amenities: ['Free shuttle', 'Pool', 'Fitness center'],
              rating: 4.2
            }
          ]
        };

      case 'activityScout':
        return {
          activities: [
            {
              name: 'Coral World Ocean Park',
              location: 'St. Thomas',
              price: '$25/adult',
              type: 'Marine life experience'
            },
            {
              name: 'Dunn\'s River Falls',
              location: 'Jamaica',
              price: '$30/adult',
              type: 'Natural attraction'
            }
          ]
        };

      default:
        return { message: 'Agent processing complete' };
    }
  };

  // Generate Comprehensive Plan (W. Edwards Deming quality approach)
  const generateComprehensivePlan = async (data: any, agentResults: any): Promise<TripPlan> => {
    const totalFlightCost = 320 * data.travelers; // Delta flights
    const totalCruiseCost = 899 * data.travelers; // Royal Caribbean
    const totalHotelCost = 179 * 2; // 2 nights pre/post
    const totalActivityCost = 55 * data.travelers; // Activities per person

    return {
      id: `trip-${Date.now()}`,
      type: data.type,
      destination: data.destinations,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      travelers: data.travelers,
      from: data.from,
      recommendations: {
        accommodations: agentResults.hotelFinder?.prePost || [],
        activities: agentResults.activityScout?.activities || [],
        transportation: agentResults.flightExpert?.flights || [],
        dining: agentResults.cruiseSpecialist?.cruiseLines || [],
        totalCost: totalFlightCost + totalCruiseCost + totalHotelCost + totalActivityCost,
        highlights: [
          '7-night Caribbean cruise with Royal Caribbean',
          'Nonstop flights from Indianapolis',
          'Pre-cruise Miami hotel stay',
          'Snorkeling at Coral World Ocean Park',
          'Climbing Dunn\'s River Falls in Jamaica'
        ]
      },
      aiAgents: agentResults
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header - Steve Jobs minimalist design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌟 Find Perfect Trip</h1>
        <p className="text-gray-600">AI-powered travel planning with collective expert wisdom</p>
      </motion.div>

      {/* Current Trip Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Your Trip Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Ship className="w-4 h-4 mr-2 text-blue-500" />
            <span><strong>Type:</strong> {tripData.type}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-green-500" />
            <span><strong>Dates:</strong> {tripData.startDate} - {tripData.endDate}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-purple-500" />
            <span><strong>Travelers:</strong> {tripData.travelers} family members</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span><strong>Destinations:</strong> {tripData.destinations.join(', ')}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            <span><strong>Budget:</strong> ${tripData.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Plane className="w-4 h-4 mr-2 text-blue-500" />
            <span><strong>From:</strong> {tripData.from}</span>
          </div>
        </div>
      </motion.div>

      {/* AI Agents Processing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">🤖 AI Travel Agents</h2>
          <button
            onClick={processWithAIAgents}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Find Perfect Trip'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(aiAgents).map(([key, agent]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                agent.status === 'processing' ? 'border-blue-500 bg-blue-50' :
                agent.status === 'complete' ? 'border-green-500 bg-green-50' :
                agent.status === 'error' ? 'border-red-500 bg-red-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                {agent.icon}
                <span className="ml-2 font-medium text-sm">{agent.name}</span>
              </div>
              
              {agent.status === 'processing' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              
              <div className="text-xs mt-1 capitalize text-gray-600">
                {agent.status === 'processing' ? `${agent.progress}%` : agent.status}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trip Plan Results */}
      <AnimatePresence>
        {tripPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg p-6 border"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">🎉 Your Perfect Trip Plan</h2>
            
            {/* Cost Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6 border border-green-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700">
                  ${tripPlan.recommendations.totalCost.toLocaleString()}
                </div>
                <div className="text-green-600">Total Estimated Cost</div>
                <div className="text-sm text-green-500 mt-1">
                  {tripPlan.recommendations.totalCost <= tripPlan.budget ? 
                    `✅ Within your $${tripPlan.budget.toLocaleString()} budget` :
                    `⚠️ Over budget by $${(tripPlan.recommendations.totalCost - tripPlan.budget).toLocaleString()}`
                  }
                </div>
              </div>
            </div>

            {/* Trip Highlights */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">🌟 Trip Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tripPlan.recommendations.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Recommendations */}
            <div className="space-y-6">
              {/* Transportation */}
              {tripPlan.recommendations.transportation.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Plane className="w-5 h-5 mr-2" />
                    ✈️ Flights
                  </h3>
                  <div className="grid gap-3">
                    {tripPlan.recommendations.transportation.map((flight: any, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{flight.airline} - {flight.route}</div>
                            <div className="text-sm text-gray-600">{flight.duration} • {flight.stops}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{flight.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodations */}
              {tripPlan.recommendations.accommodations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Hotel className="w-5 h-5 mr-2" />
                    🏨 Hotels
                  </h3>
                  <div className="grid gap-3">
                    {tripPlan.recommendations.accommodations.map((hotel: any, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{hotel.hotel}</div>
                            <div className="text-sm text-gray-600">
                              {hotel.amenities?.join(' • ')} • Rating: {hotel.rating}/5
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{hotel.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {tripPlan.recommendations.activities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    🎯 Activities
                  </h3>
                  <div className="grid gap-3">
                    {tripPlan.recommendations.activities.map((activity: any, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            <div className="text-sm text-gray-600">{activity.location} • {activity.type}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{activity.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                💾 Save Trip Plan
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                📧 Share with Family
              </button>
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                📅 Add to Calendar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
