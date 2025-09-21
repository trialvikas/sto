
export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBands {
  middle: number;
  upper: number;
  lower: number;
}

export interface CalculatedDataPoint extends HistoricalData {
  ema20?: number;
  ema50?: number;
  ema200?: number;
  rsi?: number;
  bb?: BollingerBands;
}
