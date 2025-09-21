
import React, { useState } from 'react';

interface TickerInputProps {
  onTickerChange: (ticker: string) => void;
  initialTicker: string;
}

export const TickerInput: React.FC<TickerInputProps> = ({ onTickerChange, initialTicker }) => {
  const [inputValue, setInputValue] = useState(initialTicker);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onTickerChange(inputValue.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter stock ticker (e.g. GOOGL)"
        className="bg-brand-surface border border-gray-600 rounded-md py-2 px-4 w-40 sm:w-48 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
      />
      <button
        type="submit"
        className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
      >
        Analyze
      </button>
    </form>
  );
};
