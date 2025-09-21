
import React from 'react';
import { AnalysisZone } from '../lib/analysis';

interface AnalysisDisplayProps {
  analysis: AnalysisZone;
  ticker: string;
}

const analysisConfig = {
  [AnalysisZone.BULLISH]: {
    label: "Bullish Zone",
    color: "bg-green-500/20 border-green-500 text-green-300",
    description: "Price is above key moving averages and shows strong upward momentum. Conditions suggest a potential uptrend.",
  },
  [AnalysisZone.BEARISH]: {
    label: "Bearish Zone",
    color: "bg-red-500/20 border-red-500 text-red-300",
    description: "Price is below key moving averages, indicating potential weakness and a downtrend.",
  },
  [AnalysisZone.CONSOLIDATION]: {
    label: "Consolidation Zone",
    color: "bg-orange-500/20 border-orange-500 text-orange-300",
    description: "The stock is in a period of indecision, trading within a range. No clear trend is established.",
  },
  [AnalysisZone.LOADING]: {
    label: "Analyzing...",
    color: "bg-gray-500/20 border-gray-500 text-gray-300",
    description: "Calculating indicators and determining market sentiment for the selected stock.",
  },
  [AnalysisZone.ERROR]: {
    label: "Analysis Unavailable",
    color: "bg-gray-700/20 border-gray-700 text-gray-400",
    description: "Could not perform analysis due to an error.",
  }
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, ticker }) => {
  const config = analysisConfig[analysis];

  return (
    <div className={`p-6 rounded-lg shadow-lg border ${config.color}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-text-secondary">Analysis for {ticker}</h3>
          <p className="text-2xl font-bold text-white">{config.label}</p>
        </div>
        <p className="sm:text-right max-w-md">{config.description}</p>
      </div>
    </div>
  );
};
