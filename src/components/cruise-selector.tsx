"use client";

import React, { useState } from 'react';
import './cruise-selector.css';
import { usStates } from '@/data/states';

export function CruiseSelector() {
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <form onSubmit={handleSearch} className="cruise-selector">
        <h2 className="text-xl font-bold text-center mb-2">Cruise Deals on All Major Cruise Lines</h2>
        <div className="text-center mb-4">
            <a href="#" className="text-sm font-bold text-blue-600 hover:underline">RESIDENCY DISCOUNTS</a>
        </div>
      <div className="input-grid">
        <select className="form-input" defaultValue="caribbean">
          <option value="caribbean">Caribbean/Bahamas</option>
          <option value="alaska">Alaska</option>
          <option value="europe">Europe</option>
        </select>
        <select className="form-input" defaultValue="all-lines">
          <option value="all-lines">All Cruise Lines</option>
          <option value="carnival">Carnival</option>
          <option value="royal-caribbean">Royal Caribbean</option>
          <option value="norwegian">Norwegian</option>
        </select>
        <select className="form-input" defaultValue="2025-11">
          <option value="2025-11">Nov 2025</option>
          <option value="2025-12">Dec 2025</option>
          <option value="2026-01">Jan 2026</option>
        </select>
        <select className="form-input">
            <option value="">State/Province</option>
            {usStates.map(state => (
                <option key={state.code} value={state.code}>{state.name}</option>
            ))}
        </select>
      </div>
      <div className="input-grid" style={{ marginTop: '1rem' }}>
        <select className="form-input" defaultValue="all-ports">
          <option value="all-ports">All Ports</option>
          <option value="miami">Miami, FL</option>
          <option value="port-canaveral">Port Canaveral, FL</option>
          <option value="fort-lauderdale">Fort Lauderdale, FL</option>
        </select>
        <select className="form-input" defaultValue="all-ships">
          <option value="all-ships">All Ships</option>
        </select>
        <select className="form-input" defaultValue="all-lengths">
          <option value="all-lengths">All Lengths</option>
          <option value="1-5">1-5 Days</option>
          <option value="6-9">6-9 Days</option>
          <option value="10+">10+ Days</option>
        </select>
        <button type="submit" className="cruise-search-button" disabled={loading}>
          {loading ? 'Searching...' : 'SEARCH'}
        </button>
      </div>
    </form>
  );
}
