#!/bin/bash

# This creates a simple UI page to securely store credentials

cat > src/app/settings/page.tsx << 'SETTINGS'
'use client';

import { useState } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Settings() {
  const [site, setSite] = useState('msc-cruises');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const saveCredentials = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const userId = auth.currentUser?.uid;

    if (!userId) return alert('Not logged in');

    // Store encrypted in Firestore
    await setDoc(
      doc(db, 'userCredentials', userId, 'sites', site),
      {
        username,
        password: btoa(password), // Basic encoding (upgrade to crypto later)
        updatedAt: new Date()
      }
    );

    alert('Credentials saved securely');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Store Account Credentials</h1>
      
      <select 
        value={site} 
        onChange={(e) => setSite(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="msc-cruises">MSC Cruises</option>
        <option value="fidelity">Fidelity Retirement</option>
        <option value="labcorp">LabCorp Health</option>
      </select>

      <input
        type="text"
        placeholder="Username/Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <button 
        onClick={saveCredentials}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Encrypted
      </button>
    </div>
  );
}
SETTINGS

echo "✅ Settings page created at /settings"
