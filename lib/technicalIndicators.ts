
import type { HistoricalData, CalculatedDataPoint, BollingerBands } from '../types';

// --- Helper Functions ---

const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = 0; i <= data.length - period; i++) {
    const slice = data.slice(i, i + period);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    sma.push(sum / period);
  }
  return sma;
};

const calculateEMA = (data: number[], period: number): (number | undefined)[] => {
  if (data.length < period) return Array(data.length).fill(undefined);
  
  const results: (number | undefined)[] = Array(period - 1).fill(undefined);
  const multiplier = 2 / (period + 1);
  
  // Initial SMA
  let previousEma = data.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  results.push(previousEma);
  
  for (let i = period; i < data.length; i++) {
    const ema = (data[i] - previousEma) * multiplier + previousEma;
    results.push(ema);
    previousEma = ema;
  }
  
  return results;
};

const calculateRSI = (data: number[], period: number = 14): (number | undefined)[] => {
    if (data.length < period + 1) return Array(data.length).fill(undefined);

    const results: (number | undefined)[] = Array(period).fill(undefined);
    const changes = data.slice(1).map((val, i) => val - data[i]);

    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 0; i < period; i++) {
        if (changes[i] > 0) {
            avgGain += changes[i];
        } else {
            avgLoss -= changes[i];
        }
    }

    avgGain /= period;
    avgLoss /= period;
    
    let rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    results.push(100 - (100 / (1 + rs)));

    for (let i = period; i < changes.length; i++) {
        const change = changes[i];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
        results.push(100 - (100 / (1 + rs)));
    }

    return results;
};


const calculateBollingerBands = (data: number[], period: number = 44, stdDevMultiplier: number = 2): (BollingerBands | undefined)[] => {
    if (data.length < period) return Array(data.length).fill(undefined);
    
    const results: (BollingerBands | undefined)[] = Array(period - 1).fill(undefined);

    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const mean = slice.reduce((sum, val) => sum + val, 0) / period;
        
        const sqDiffs = slice.map(val => (val - mean) ** 2);
        const variance = sqDiffs.reduce((sum, val) => sum + val, 0) / period;
        const stdDev = Math.sqrt(variance);

        results.push({
            middle: mean,
            upper: mean + stdDev * stdDevMultiplier,
            lower: mean - stdDev * stdDevMultiplier,
        });
    }

    return results;
};


// --- Main Calculation Orchestrator ---

export const calculateAllIndicators = (historicalData: HistoricalData[]): CalculatedDataPoint[] => {
  const closePrices = historicalData.map(d => d.close);

  const emas20 = calculateEMA(closePrices, 20);
  const emas50 = calculateEMA(closePrices, 50);
  const emas200 = calculateEMA(closePrices, 200);
  const rsis = calculateRSI(closePrices, 14);
  const bbs = calculateBollingerBands(closePrices, 44, 2);

  return historicalData.map((dataPoint, index) => ({
    ...dataPoint,
    ema20: emas20[index],
    ema50: emas50[index],
    ema200: emas200[index],
    rsi: rsis[index],
    bb: bbs[index],
  }));
};
