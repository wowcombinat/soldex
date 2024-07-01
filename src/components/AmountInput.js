import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

function AmountInput({ value, onChange, max }) {
  const handleIncrement = () => {
    onChange(Math.min(parseFloat(value) + 0.1, max).toFixed(1));
  };

  const handleDecrement = () => {
    onChange(Math.max(parseFloat(value) - 0.1, 0).toFixed(1));
  };

  return (
    <div className="amount-input">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.0"
        step="0.1"
        min="0"
        max={max}
      />
      <div className="amount-controls">
        <button onClick={handleIncrement} className="amount-control-button">
          <ChevronUp size={20} />
        </button>
        <button onClick={handleDecrement} className="amount-control-button">
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
}

export default AmountInput;
