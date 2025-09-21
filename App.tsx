
import React, { useState, useEffect, useCallback } from 'react';
import { TickerInput } from './components/TickerInput';
import { Dashboard } from './components/Dashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { fetchHistoricalData } from './services/stockService';
import { calculateAllIndicators } from './lib/technicalIndicators';
import type { HistoricalData, CalculatedDataPoint } from './types';
import { AnalysisZone, getAnalysis } from './lib/analysis';

const App: React.FC = () => {
  const [ticker, setTicker] = useState<string>('AAPL');
  const [data, setData] = useState<CalculatedDataPoint[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<CalculatedDataPoint | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisZone>(AnalysisZone.LOADING);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const processStockData = useCallback(async (currentTicker: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(AnalysisZone.LOADING);

    try {
      const rawData: HistoricalData[] = await fetchHistoricalData(currentTicker);
      if (rawData.length < 200) {
        throw new Error("Not enough historical data to perform analysis. Please try another stock.");
      }
      
      const calculatedData = calculateAllIndicators(rawData);
      setData(calculatedData);

      const lastDataPoint = calculatedData[calculatedData.length - 1];
      if(lastDataPoint) {
        setLatestMetrics(lastDataPoint);
        setAnalysis(getAnalysis(lastDataPoint));
      } else {
        throw new Error("Failed to calculate technical indicators.");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setData([]);
      setLatestMetrics(null);
      setAnalysis(AnalysisZone.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    processStockData(ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  const handleTickerChange = (newTicker: string) => {
    if(newTicker && newTicker.trim().toUpperCase() !== ticker) {
        setTicker(newTicker.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Stock Analysis Dashboard</h1>
          </div>
          <TickerInput onTickerChange={handleTickerChange} initialTicker={ticker} />
        </header>

        <main>
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          ) : (
            <Dashboard 
              ticker={ticker}
              data={data} 
              latestMetrics={latestMetrics} 
              analysis={analysis}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
