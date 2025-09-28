'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Ship, Car, Hotel, DollarSign, Map, Users, Calendar, Settings, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import TravelDashboard from '@/components/TravelDashboard';
import AgentSelector from '@/components/AgentSelector';
import FamilyProfile from '@/components/FamilyProfile';
import TripComparison from '@/components/TripComparison';
import { initializeCoordinator, planTrip } from '@/agents/coordinator/MainTravelAgent';
import { FamilyData, TripRequest, AgentConfig, FullTripRequest } from '@/lib/travel-types';
import { DEFAULT_FAMILY } from '@/lib/constants';
import { LayoutWrapper } from '@/components/layout-wrapper';

/**
 * SP Travel Coordinator Main Page
 * Embodying wisdom of: Expedia founders, Priceline architects, Google Maps team
 */
export default function TravelCoordinatorPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'compare' | 'reports' | 'settings'>('plan');
  const [family, setFamily] = useState<FamilyData>(DEFAULT_FAMILY);
  const [activeAgents, setActiveAgents] = useState<string[]>(['cruise', 'flight', 'hotel']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCoordinatorReady, setIsCoordinatorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the main coordinator with SP methodology
    const initCoordinator = async () => {
      try {
        const result = await initializeCoordinator();
        if (result.success) {
          setIsCoordinatorReady(true);
        } else {
          setError('Failed to initialize Travel Coordinator');
        }
      } catch (err) {
        setError('Failed to initialize Travel Coordinator');
        console.error('SP Coordinator Init Error:', err);
      }
    };
    initCoordinator();
  }, []);

  const handleTripRequest = async (request: TripRequest) => {
    if (!isCoordinatorReady) {
      setError('Coordinator not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const fullRequest: FullTripRequest = {
        ...request,
        family,
        activeAgents,
        origin: family.homeAddress.city,
      };
      const result = await planTrip(fullRequest);
      
      // Handle the result - will be connected to the dashboard
      console.log('SP Trip Planning Result:', result);
      alert('Trip planning complete! Check the console for results.');


    } catch (err) {
      setError('Failed to process trip request');
      console.error('SP Trip Planning Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const tabConfig = [
    { id: 'plan', label: 'Plan Trip', icon: Map },
    { id: 'compare', label: 'Compare', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <LayoutWrapper className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* SP Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-6"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Travel Coordinator</h1>
                <p className="text-gray-600">Powered by 1000+ Travel Experts' Collective Wisdom</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {activeAgents.length} Agents Active
              </div>
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">{family.members.length} Family Members</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-2 flex space-x-2">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto mb-4"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2">
                <TravelDashboard
                  family={family}
                  onTripRequest={handleTripRequest}
                  isProcessing={isProcessing}
                />
              </div>
              <div className="space-y-6">
                <AgentSelector
                  activeAgents={activeAgents}
                  onAgentToggle={setActiveAgents}
                />
                <FamilyProfile
                  family={family}
                  onFamilyUpdate={setFamily}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TripComparison family={family} />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4">Travel Reports</h2>
              <p className="text-gray-600">Reports functionality coming soon...</p>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-gray-600">Settings functionality coming soon...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutWrapper>
  );
}
