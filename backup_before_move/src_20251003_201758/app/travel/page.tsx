'use client';

import { useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function TravelPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchMSC = async () => {
    setLoading(true);
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const response = await fetch(
      'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/mscCruiseAgent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      }
    );

    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Travel Search</h1>
      
      <button 
        onClick={searchMSC}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        {loading ? 'Searching MSC Account...' : 'Get My MSC Cruises'}
      </button>

      {results?.cruises && (
        <div className="mt-8">
          {results.cruises.map((cruise: any, i: number) => (
            <div key={i} className="border p-4 mb-4">
              <h3 className="font-bold">{cruise.cruiseName}</h3>
              <p>Dates: {cruise.dates}</p>
              <p>Cabin: {cruise.cabin}</p>
              <p>Price: {cruise.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
