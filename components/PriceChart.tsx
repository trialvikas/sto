
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { CalculatedDataPoint } from '../types';

interface PriceChartProps {
  data: CalculatedDataPoint[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
    // We might have a lot of data points, so we can sample for better performance if needed
    const chartData = data.slice(-252); // Show last year of trading days

    return (
    <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} domain={['auto', 'auto']} tickFormatter={(value) => `$${Number(value).toFixed(0)}`} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(30, 34, 45, 0.9)',
                    borderColor: '#4b5563',
                    borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#d1d5db' }}
                formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Line type="monotone" dataKey="close" name="Price" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ema20" name="20 EMA" stroke="#a855f7" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="ema50" name="50 EMA" stroke="#f97316" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="ema200" name="200 EMA" stroke="#ef4444" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="bb.upper" name="Upper BB" stroke="#22c55e" strokeDasharray="5 5" strokeWidth={1} dot={false} />
            <Line type="monotone" dataKey="bb.lower" name="Lower BB" stroke="#22c55e" strokeDasharray="5 5" strokeWidth={1} dot={false} />
        </LineChart>
        </ResponsiveContainer>
    </div>
    );
};
