import type { HistoricalData } from '../types';

// A public CORS proxy is used to bypass browser cross-origin restrictions
// when calling the Yahoo Finance API directly from the client-side.
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * Fetches real historical stock data from the Yahoo Finance API for the last 15 years.
 */
export const fetchHistoricalData = async (ticker: string): Promise<HistoricalData[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 15);

  // Yahoo Finance API uses Unix timestamps for date ranges
  const period1 = Math.floor(startDate.getTime() / 1000);
  const period2 = Math.floor(endDate.getTime() / 1000);

  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker.toUpperCase()}?period1=${period1}&period2=${period2}&interval=1d&events=history`;
  
  // The final URL is wrapped in the CORS proxy
  const requestUrl = `${CORS_PROXY}${encodeURIComponent(yahooUrl)}`;

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle API-specific errors returned by Yahoo Finance
    if (data.chart.error) {
      throw new Error(`Yahoo Finance API error: ${data.chart.error.description}`);
    }

    const result = data.chart.result[0];
    if (!result || !result.timestamp || result.indicators.quote[0].open === null) {
        throw new Error(`No historical data found for ticker: ${ticker}. It may be an invalid symbol.`);
    }

    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    // Transform the API response into the application's expected format
    const historicalData: HistoricalData[] = timestamps.map((ts: number, i: number) => {
        // Yahoo sometimes returns null for quotes on certain days (e.g., holidays with no trading).
        // We filter these out to avoid errors in calculations.
        if (quotes.open[i] === null || quotes.high[i] === null || quotes.low[i] === null || quotes.close[i] === null || quotes.volume[i] === null) {
            return null;
        }
        return {
            date: new Date(ts * 1000).toISOString().split('T')[0],
            open: quotes.open[i],
            high: quotes.high[i],
            low: quotes.low[i],
            close: quotes.close[i],
            volume: quotes.volume[i],
        };
    }).filter((item): item is HistoricalData => item !== null); // This type guard filters out null entries

    if (historicalData.length === 0) {
      throw new Error(`Data for ${ticker} is available but contains no valid trading days.`);
    }

    return historicalData;

  } catch (error) {
    console.error('Error fetching real stock data:', error);
    // Provide a more user-friendly error message
    if (error instanceof Error) {
        throw new Error(`Could not fetch data for "${ticker}". Please check the ticker symbol and your network connection.`);
    }
    throw new Error(`An unknown error occurred while fetching data for "${ticker}".`);
  }
};
