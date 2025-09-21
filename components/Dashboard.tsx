
import React from 'react';
import type { CalculatedDataPoint } from '../types';
import { IndicatorCard } from './IndicatorCard';
import { PriceChart } from './PriceChart';
import { AnalysisDisplay } from './AnalysisDisplay';
import { AnalysisZone } from '../lib/analysis';
import { PriceIcon, EmaIcon, RsiIcon, BbandIcon } from './Icons';

interface DashboardProps {
  ticker: string;
  data: CalculatedDataPoint[];
  latestMetrics: CalculatedDataPoint | null;
  analysis: AnalysisZone;
}

export const Dashboard: React.FC<DashboardProps> = ({ ticker, data, latestMetrics, analysis }) => {
  if (!latestMetrics) {
    return null;
  }

  const formatValue = (value?: number) => (value !== undefined ? value.toFixed(2) : 'N/A');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <IndicatorCard 
          title="Latest Price" 
          value={`$${formatValue(latestMetrics.close)}`} 
          icon={<PriceIcon />}
        />
        <IndicatorCard 
          title="20 / 50 / 200 EMA" 
          value={`${formatValue(latestMetrics.ema20)} / ${formatValue(latestMetrics.ema50)} / ${formatValue(latestMetrics.ema200)}`}
          icon={<EmaIcon />}
        />
        <IndicatorCard 
          title="RSI (14)" 
          value={formatValue(latestMetrics.rsi)}
          icon={<RsiIcon />}
        />
        <IndicatorCard 
          title="Bollinger Bands (44, 2)" 
          value={`Upper: ${formatValue(latestMetrics.bb?.upper)}`}
          subtitle={`Lower: ${formatValue(latestMetrics.bb?.lower)}`}
          icon={<BbandIcon />}
        />
      </div>
      
      <AnalysisDisplay analysis={analysis} ticker={ticker} />

      <div className="bg-brand-surface p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">{ticker} Price History & Indicators</h3>
        <PriceChart data={data} />
      </div>
    </div>
  );
};
