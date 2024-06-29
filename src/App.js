import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Wallet, RefreshCw, Info, DollarSign, Settings } from 'lucide-react';
import './App.css';

const tokenList = [
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'RAY', name: 'Raydium' },
  { symbol: 'SRM', name: 'Serum' },
];

function App() {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const simulatedRate = Math.random() * 10;
      setExchangeRate(simulatedRate);
      setToAmount((parseFloat(fromAmount) * simulatedRate).toFixed(6));
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = () => {
    console.log(`Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`);
  };

  const connectWallet = () => {
    setWalletConnected(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana DEX</h1>
        {walletConnected ? (
          <button className="wallet-button">
            <Wallet size={20} />
            <span>Connected</span>
          </button>
        ) : (
          <button onClick={connectWallet} className="wallet-button">
            <Wallet size={20} />
            <span>Connect Wallet</span>
          </button>
        )}
      </header>
      <main className="App-main">
        <div className="swap-container">
          <div className="swap-header">
            <h2>Swap</h2>
            <button className="settings-button">
              <Settings size={20} />
            </button>
          </div>
          <div className="token-input">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="amount-input"
            />
            <select 
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="token-select"
            >
              {tokenList.map((token) => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
          </div>
          <button className="switch-button" onClick={() => {
            setFromToken(toToken);
            setToToken(fromToken);
          }}>
            <ArrowDownUp size={20} />
          </button>
          <div className="token-input">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="amount-input"
            />
            <select 
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="token-select"
            >
              {tokenList.map((token) => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
          </div>
          {exchangeRate && (
            <div className="exchange-rate">
              <span>Exchange Rate:</span>
              <span>1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}</span>
              <button className="refresh-button">
                <RefreshCw size={16} />
              </button>
            </div>
          )}
          <button
            onClick={handleSwap}
            disabled={!walletConnected}
            className="swap-button"
          >
            {walletConnected ? 'Swap' : 'Connect Wallet to Swap'}
          </button>
          <div className="info-container">
            <p className="info-text">
              <Info size={12} className="info-icon" />
              <span>Always verify transaction details before swapping.</span>
            </p>
            <p className="info-text">
              <DollarSign size={12} className="info-icon" />
              <span>Market prices may change rapidly. Check rates before confirming.</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
