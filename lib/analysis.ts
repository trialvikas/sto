
import type { CalculatedDataPoint } from '../types';

export enum AnalysisZone {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  CONSOLIDATION = 'CONSOLIDATION',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}

export const getAnalysis = (latestData: CalculatedDataPoint): AnalysisZone => {
  const { close, ema50, ema200, rsi, bb } = latestData;

  // Ensure all required data is present for analysis
  if (close === undefined || ema50 === undefined || ema200 === undefined || rsi === undefined || !bb) {
    return AnalysisZone.CONSOLIDATION; // Default to consolidation if data is missing
  }

  const isBullish = close > ema50 && close > ema200 && rsi > 60 && close > bb.upper;
  if (isBullish) {
    return AnalysisZone.BULLISH;
  }
  
  // A reasonable bearish condition (opposite of bullish, with RSI below 40 as a common threshold)
  const isBearish = close < ema50 && close < ema200 && rsi < 40;
  if (isBearish) {
    return AnalysisZone.BEARISH;
  }
  
  return AnalysisZone.CONSOLIDATION;
};
