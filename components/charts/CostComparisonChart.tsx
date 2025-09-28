'use client';

import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from '../../lib/trip-types';

interface CostComparisonChartProps {
  data: ChartData[];
  height?: number;
}

function CostComparisonChartComponent({ data, height = 300 }: CostComparisonChartProps) {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="w-full" role="img" aria-label="Cost comparison chart">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Cost']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Bar
            dataKey="cost"
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
            name="Trip Cost"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const CostComparisonChart = memo(CostComparisonChartComponent);