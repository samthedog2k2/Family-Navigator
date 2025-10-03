'use client';

import React, { memo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { RadarData } from '../../lib/trip-types';

interface RadarComparisonChartProps {
  data: RadarData[];
  height?: number;
}

function RadarComparisonChartComponent({ data, height = 300 }: RadarComparisonChartProps) {
  return (
    <div className="w-full" role="img" aria-label="Trip comparison radar chart">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 12, fill: '#374151' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickCount={5}
          />
          <Radar
            name="Overall Rating"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Convenience"
            dataKey="convenience"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Family Score"
            dataKey="familyScore"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              color: '#374151',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const RadarComparisonChart = memo(RadarComparisonChartComponent);
