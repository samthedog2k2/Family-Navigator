/**
 * Firestore Import Script for Free APIs
 *
 * This script imports the free API registry from src/data/free-apis.json
 * into Firestore for runtime access by agents and the UI.
 *
 * Usage:
 *   node --loader ts-node/esm src/scripts/importFreeApis.ts
 *
 * Or from Firebase Functions:
 *   import { importFreeApis } from './scripts/importFreeApis';
 *   await importFreeApis();
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import freeApisData from '../data/free-apis.json';

/**
 * Initialize Firebase Admin if not already initialized
 */
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Check if running in Firebase environment or local
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Use default credentials (for Firebase Studio or Cloud Functions)
      initializeApp();
    }
  }
  return getFirestore();
}

/**
 * Import free APIs into Firestore
 */
export async function importFreeApis() {
  console.log('🚀 Starting Free APIs import to Firestore...\n');

  const db = initializeFirebaseAdmin();
  const batch = db.batch();
  let totalApis = 0;

  try {
    // Import each category
    for (const [category, apis] of Object.entries(freeApisData)) {
      console.log(`📂 Processing category: ${category} (${apis.length} APIs)`);

      for (const api of apis) {
        const docId = api.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const docRef = db.collection('free_apis').doc(docId);

        batch.set(docRef, {
          ...api,
          category,
          imported_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        });

        totalApis++;
      }
    }

    // Commit the batch
    await batch.commit();

    console.log(`\n✅ Successfully imported ${totalApis} APIs across ${Object.keys(freeApisData).length} categories!`);
    console.log('\n📊 Summary:');

    for (const [category, apis] of Object.entries(freeApisData)) {
      console.log(`   - ${category}: ${apis.length} APIs`);
    }

    return {
      success: true,
      totalApis,
      categories: Object.keys(freeApisData).length,
    };

  } catch (error) {
    console.error('❌ Error importing APIs:', error);
    throw error;
  }
}

/**
 * Clear all free APIs from Firestore (useful for re-imports)
 */
export async function clearFreeApis() {
  console.log('🗑️  Clearing existing free APIs from Firestore...\n');

  const db = initializeFirebaseAdmin();
  const snapshot = await db.collection('free_apis').get();

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`✅ Cleared ${snapshot.size} APIs\n`);
}

/**
 * Main execution (when run directly)
 */
if (require.main === module || import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      const args = process.argv.slice(2);

      if (args.includes('--clear')) {
        await clearFreeApis();
      }

      await importFreeApis();

      console.log('\n🎉 Import completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n💥 Import failed:', error);
      process.exit(1);
    }
  })();
}
