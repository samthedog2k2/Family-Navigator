/**
 * Example usage of the optimized TravelCoordinator
 * Demonstrates enterprise patterns and configuration
 */

import { TravelCoordinator } from '../coordinators/TravelCoordinator';
import { CoordinatorRequest, CoordinatorConfig } from '../lib/coordinator-types';

// Example configuration for production use
const productionConfig: Partial<CoordinatorConfig> = {
  globalTimeout: 180000, // 3 minutes for complex searches
  maxConcurrentAgents: 3, // Conservative for production
  cacheEnabled: true,
  circuitBreakerEnabled: true,
  retryEnabled: true,
  telemetryEnabled: true,
  logLevel: 'info',
  agents: [
    {
      id: 'cruise',
      name: 'Cruise Search Agent',
      enabled: true,
      priority: 1,
      timeout: 45000, // Cruises can take longer
      retryAttempts: 3,
      retryDelay: 2000,
      circuitBreaker: { threshold: 3, resetTime: 120000 },
      cacheSettings: { enabled: true, ttl: 20 * 60 * 1000 }, // 20 minutes
    },
    {
      id: 'flight',
      name: 'Flight Search Agent',
      enabled: true,
      priority: 1,
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1500,
      circuitBreaker: { threshold: 5, resetTime: 90000 },
      cacheSettings: { enabled: true, ttl: 10 * 60 * 1000 }, // 10 minutes
    },
    // ... other agents
  ],
};

// Example family data
const exampleFamily = {
  id: 'family-123',
  members: [
    { id: 'dad', name: 'Adam', age: 35, preferences: {} },
    { id: 'mom', name: 'Holly', age: 32, preferences: {} },
    { id: 'son', name: 'Ethan', age: 12, preferences: {} },
    { id: 'daughter', name: 'Elle', age: 8, preferences: {} },
  ],
  homeAddress: {
    street: '123 Main Street',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46250',
  },
  defaultAirport: 'IND',
  preferences: {
    carDefaults: {
      year: 2022,
      make: 'Toyota',
      model: 'Highlander',
      mpg: 28,
      fuelType: 'gasoline',
    },
    hotelDefaults: {
      maxBudgetPerNight: 200,
      chains: ['Marriott', 'Hilton'],
      nearbyPOI: ['beach', 'theme parks'],
    },
    flightDefaults: {
      class: 'economy',
    },
    cruiseDefaults: {
      cabinType: 'balcony',
    },
  },
};

async function demonstrateBasicUsage() {
  console.log('🚀 Demonstrating Basic Usage');

  // Create coordinator with default configuration
  const coordinator = new TravelCoordinator();

  try {
    // Initialize the coordinator
    await coordinator.initialize();

    // Create a trip request
    const request: CoordinatorRequest = {
      id: 'trip-001',
      type: 'cruise',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-07-22'),
      destinations: ['Caribbean', 'Bahamas'],
      budget: {
        total: 8000,
        flexibility: 'flexible',
      },
      interests: ['beaches', 'snorkeling', 'family-friendly'],
      family: exampleFamily,
      activeAgents: ['cruise', 'weather', 'deals'],
      priority: 'medium',
      requestId: 'req-001',
    };

    // Plan the trip
    console.log('Planning trip...');
    const tripPlan = await coordinator.planTrip(request);

    console.log('Trip Plan Generated:');
    console.log(`- Total Cost: $${tripPlan.totalCost.total.toLocaleString()}`);
    console.log(`- Segments: ${tripPlan.segments.length}`);
    console.log(`- Recommendations: ${tripPlan.recommendations.length}`);
    console.log(`- Warnings: ${tripPlan.warnings.length}`);

    return tripPlan;

  } catch (error) {
    console.error('Trip planning failed:', error);
    throw error;
  } finally {
    await coordinator.shutdown();
  }
}

async function demonstrateAdvancedUsage() {
  console.log('🎯 Demonstrating Advanced Usage with Monitoring');

  // Create coordinator with production configuration
  const coordinator = new TravelCoordinator(productionConfig);

  try {
    await coordinator.initialize();

    // Multiple concurrent trip requests
    const requests: CoordinatorRequest[] = [
      {
        id: 'trip-cruise',
        type: 'cruise',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-08'),
        destinations: ['Mediterranean'],
        budget: { total: 10000, flexibility: 'strict' },
        interests: ['culture', 'history'],
        family: exampleFamily,
        activeAgents: ['cruise', 'weather', 'deals', 'expense'],
        priority: 'high',
      },
      {
        id: 'trip-flight',
        type: 'flight',
        startDate: new Date('2024-08-15'),
        endDate: new Date('2024-08-25'),
        destinations: ['Hawaii'],
        budget: { total: 12000, flexibility: 'flexible' },
        interests: ['beaches', 'hiking', 'snorkeling'],
        family: exampleFamily,
        activeAgents: ['flight', 'hotel', 'weather', 'deals'],
        priority: 'medium',
      },
      {
        id: 'trip-roadtrip',
        type: 'roadtrip',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-10'),
        destinations: ['Yellowstone', 'Grand Canyon'],
        budget: { total: 5000, flexibility: 'very-flexible' },
        interests: ['nature', 'camping', 'scenic'],
        family: exampleFamily,
        activeAgents: ['route', 'hotel', 'weather'],
        priority: 'low',
      },
    ];

    // Execute requests concurrently
    console.log('Planning multiple trips concurrently...');
    const tripPromises = requests.map(request => coordinator.planTrip(request));
    const tripPlans = await Promise.allSettled(tripPromises);

    // Analyze results
    tripPlans.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const plan = result.value;
        console.log(`✅ Trip ${requests[index].id}: $${plan.totalCost.total.toLocaleString()}`);
      } else {
        console.error(`❌ Trip ${requests[index].id} failed:`, result.reason.message);
      }
    });

    // Check system health
    console.log('\n📊 System Health Check:');
    const health = await coordinator.getSystemHealth();
    console.log(`System Status: ${health.status}`);
    console.log(`Cache Hit Rate: ${(health.cache.hitRate * 100).toFixed(1)}%`);
    console.log(`Active Requests: ${health.processing.activeRequests}`);

    // Display agent health
    health.agents.forEach(agent => {
      console.log(`${agent.id}: ${agent.status} - ${agent.details}`);
    });

    return { tripPlans, health };

  } catch (error) {
    console.error('Advanced usage failed:', error);
    throw error;
  } finally {
    await coordinator.shutdown();
  }
}

async function demonstrateErrorHandling() {
  console.log('🛡️ Demonstrating Error Handling and Resilience');

  const coordinator = new TravelCoordinator({
    // Configure for more aggressive retries and shorter timeouts for testing
    agents: [
      {
        id: 'cruise',
        name: 'Cruise Search Agent',
        enabled: true,
        priority: 1,
        timeout: 5000, // Short timeout for testing
        retryAttempts: 2,
        retryDelay: 1000,
        circuitBreaker: { threshold: 2, resetTime: 30000 },
        cacheSettings: { enabled: true, ttl: 5 * 60 * 1000 },
      },
    ],
    telemetryEnabled: true,
    logLevel: 'debug',
  });

  try {
    await coordinator.initialize();

    // Create a request that might trigger errors
    const request: CoordinatorRequest = {
      id: 'error-test',
      type: 'cruise',
      startDate: new Date('2024-12-25'), // Holiday pricing might cause issues
      endDate: new Date('2024-12-31'),
      destinations: ['Antarctica'], // Unusual destination
      budget: { total: 100, flexibility: 'strict' }, // Unrealistic budget
      interests: ['penguins'],
      family: exampleFamily,
      activeAgents: ['cruise', 'flight', 'hotel'], // Mix of agents
      priority: 'high',
    };

    console.log('Executing request with potential errors...');
    const result = await coordinator.planTrip(request);

    console.log('Request completed despite errors:');
    console.log(`Warnings: ${result.warnings.length}`);
    result.warnings.forEach(warning => console.log(`⚠️  ${warning}`));

  } catch (error) {
    console.log('Expected error occurred:', error.message);
  } finally {
    // Check final system state
    const finalHealth = await coordinator.getSystemHealth();
    console.log('\nFinal System State:');
    console.log(`Status: ${finalHealth.status}`);

    await coordinator.shutdown();
  }
}

async function demonstrateCaching() {
  console.log('📦 Demonstrating Intelligent Caching');

  const coordinator = new TravelCoordinator({
    cacheEnabled: true,
    logLevel: 'info',
  });

  try {
    await coordinator.initialize();

    const baseRequest: CoordinatorRequest = {
      id: 'cache-test',
      type: 'flight',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-08'),
      destinations: ['New York'],
      budget: { total: 3000, flexibility: 'flexible' },
      interests: ['city', 'culture'],
      family: exampleFamily,
      activeAgents: ['flight', 'hotel'],
      priority: 'medium',
    };

    // First request - should miss cache
    console.log('First request (cache miss expected):');
    const start1 = Date.now();
    await coordinator.planTrip(baseRequest);
    const time1 = Date.now() - start1;
    console.log(`Completed in ${time1}ms`);

    // Second identical request - should hit cache
    console.log('\nSecond identical request (cache hit expected):');
    const start2 = Date.now();
    await coordinator.planTrip({ ...baseRequest, requestId: 'cache-test-2' });
    const time2 = Date.now() - start2;
    console.log(`Completed in ${time2}ms`);

    // Check cache performance
    const health = await coordinator.getSystemHealth();
    console.log(`\nCache Performance:`);
    console.log(`Hit Rate: ${(health.cache.hitRate * 100).toFixed(1)}%`);
    console.log(`Size: ${health.cache.size} entries`);

    if (time2 < time1 * 0.5) {
      console.log('✅ Caching working effectively!');
    } else {
      console.log('⚠️ Cache performance unclear');
    }

  } finally {
    await coordinator.shutdown();
  }
}

// Main execution
async function runExamples() {
  try {
    await demonstrateBasicUsage();
    console.log('\n' + '='.repeat(60) + '\n');

    await demonstrateAdvancedUsage();
    console.log('\n' + '='.repeat(60) + '\n');

    await demonstrateErrorHandling();
    console.log('\n' + '='.repeat(60) + '\n');

    await demonstrateCaching();

  } catch (error) {
    console.error('Example execution failed:', error);
  }
}

// Export for use in other modules
export {
  demonstrateBasicUsage,
  demonstrateAdvancedUsage,
  demonstrateErrorHandling,
  demonstrateCaching,
  runExamples,
  exampleFamily,
  productionConfig,
};

// Run if called directly
if (require.main === module) {
  runExamples();
}