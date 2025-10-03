import { useState, useCallback, useMemo } from 'react';
import { Trip, ComparisonState, ChartData, RadarData, TripMetric } from '../lib/trip-types';

export function useTripComparison(trips: Trip[], onTripSelect?: (tripIds: string[]) => void) {
  const [state, setState] = useState<ComparisonState>({
    selectedTrips: [],
    isLoading: false,
    error: null,
    sortBy: 'cost',
    sortOrder: 'asc',
  });

  const selectedTripData = useMemo(() =>
    trips.filter(trip => state.selectedTrips.includes(trip.id)),
    [trips, state.selectedTrips]
  );

  const sortedTrips = useMemo(() => {
    const sorted = [...trips].sort((a, b) => {
      const aValue = a[state.sortBy];
      const bValue = b[state.sortBy];
      const modifier = state.sortOrder === 'asc' ? 1 : -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * modifier;
      }

      return String(aValue).localeCompare(String(bValue)) * modifier;
    });

    return sorted;
  }, [trips, state.sortBy, state.sortOrder]);

  const chartData = useMemo((): ChartData[] =>
    selectedTripData.map(trip => ({
      name: trip.name.split(' ')[0] || trip.name.substring(0, 10),
      cost: trip.cost,
      duration: trip.duration,
      rating: trip.rating,
    })),
    [selectedTripData]
  );

  const radarData = useMemo((): RadarData[] =>
    selectedTripData.map(trip => ({
      metric: trip.name.split(' ')[0] || trip.name.substring(0, 10),
      value: trip.rating * 20, // Scale 0-5 to 0-100
      convenience: trip.convenience * 10, // Scale 0-10 to 0-100
      familyScore: trip.familyFriendly * 10, // Scale 0-10 to 0-100
    })),
    [selectedTripData]
  );

  const toggleTripSelection = useCallback((tripId: string) => {
    setState(prev => {
      const newSelected = prev.selectedTrips.includes(tripId)
        ? prev.selectedTrips.filter(id => id !== tripId)
        : [...prev.selectedTrips, tripId];

      onTripSelect?.(newSelected);

      return {
        ...prev,
        selectedTrips: newSelected,
      };
    });
  }, [onTripSelect]);

  const selectAllTrips = useCallback(() => {
    const allTripIds = trips.map(trip => trip.id);
    setState(prev => ({ ...prev, selectedTrips: allTripIds }));
    onTripSelect?.(allTripIds);
  }, [trips, onTripSelect]);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedTrips: [] }));
    onTripSelect?.([]);
  }, [onTripSelect]);

  const setSorting = useCallback((sortBy: ComparisonState['sortBy'], sortOrder?: ComparisonState['sortOrder']) => {
    setState(prev => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder || (prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'),
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const comparisonMetrics = useMemo(() => {
    if (selectedTripData.length === 0) return null;

    return {
      averageCost: selectedTripData.reduce((sum, trip) => sum + trip.cost, 0) / selectedTripData.length,
      totalDuration: selectedTripData.reduce((sum, trip) => sum + trip.duration, 0),
      averageRating: selectedTripData.reduce((sum, trip) => sum + trip.rating, 0) / selectedTripData.length,
      bestValue: selectedTripData.reduce((best, trip) =>
        (trip.rating / trip.cost * 1000) > (best.rating / best.cost * 1000) ? trip : best
      ),
    };
  }, [selectedTripData]);

  const hasSelection = state.selectedTrips.length > 0;
  const canCompare = state.selectedTrips.length >= 2;

  return {
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
      setLoading,
    },
  };
}
