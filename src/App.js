import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Wallet, RefreshCw, Info, DollarSign, Settings, TrendingUp, Clock } from 'lucide-react';
import './App.css';

const tokenList = [
  { symbol: 'SOL', name: 'Solana', balance: 10, color: '#00FFA3' },
  { symbol: 'USDC', name: 'USD Coin', balance: 1000, color: '#2775CA' },
  { symbol: 'RAY', name: 'Raydium', balance: 100, color: '#E841424' },
  { symbol: 'SRM', name: 'Serum', balance: 500, color: '#3B3B98' },
];

function App() {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [balances, setBalances] = useState({});
  const [recentTrades, setRecentTrades] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const simulatedRate = (Math.random() * 10 + 1).toFixed(6);
      setExchangeRate(simulatedRate);
      setToAmount((parseFloat(fromAmount) * simulatedRate).toFixed(6));
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = () => {
    if (parseFloat(fromAmount) > balances[fromToken]) {
      alert('Insufficient balance');
      return;
    }
    
    setBalances(prev => ({
      ...prev,
      [fromToken]: (prev[fromToken] - parseFloat(fromAmount)).toFixed(6),
      [toToken]: (prev[toToken] + parseFloat(toAmount)).toFixed(6)
    }));

    const newTrade = {
      from: fromToken,
      to: toToken,
      amount: fromAmount,
      date: new Date().toLocaleString()
    };
    setRecentTrades([newTrade, ...recentTrades.slice(0, 4)]);

    alert(`Swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`);
    setFromAmount('');
    setToAmount('');
  };

  const connectWallet = () => {
    setWalletConnected(true);
    const initialBalances = {};
    tokenList.forEach(token => {
      initialBalances[token.symbol] = token.balance;
    });
    setBalances(initialBalances);
  };

  const refreshRate = () => {
    const newRate = (Math.random() * 10 + 1).toFixed(6);
    setExchangeRate(newRate);
    setToAmount((parseFloat(fromAmount) * newRate).toFixed(6));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana DEX</h1>
        {walletConnected ? (
          <div className="wallet-info">
            <span>Balance: {balances[fromToken]} {fromToken}</span>
            <button className="wallet-button">
              <Wallet size={20} />
              <span>Connected</span>
            </button>
          </div>
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
              style={{backgroundColor: tokenList.find(t => t.symbol === fromToken)?.color}}
            >
              {tokenList.map((token) => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
          </div>
          <button className="switch-button" onClick={() => {
            setFromToken(toToken);
            setToToken(fromToken);
            setFromAmount(toAmount);
            setToAmount(fromAmount);
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
              style={{backgroundColor: tokenList.find(t => t.symbol === toToken)?.color}}
            >
              {tokenList.map((token) => (
                <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
              ))}
            </select>
          </div>
          {exchangeRate && (
            <div className="exchange-rate">
              <span>Exchange Rate:</span>
              <span>1 {fromToken} = {exchangeRate} {toToken}</span>
              <button className="refresh-button" onClick={refreshRate}>
                <RefreshCw size={16} />
              </button>
            </div>
          )}
          <button
            onClick={handleSwap}
            disabled={!walletConnected || !fromAmount}
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
        <button className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Hide' : 'Show'} Advanced Info
        </button>
        {showAdvanced && (
          <div className="advanced-info">
            <div className="recent-trades">
              <h3>Recent Trades</h3>
              {recentTrades.map((trade, index) => (
                <div key={index} className="trade-item">
                  <Clock size={12} />
                  <span>{trade.date}: {trade.amount} {trade.from} to {trade.to}</span>
                </div>
              ))}
            </div>
            <div className="market-info">
              <h3>Market Info</h3>
              <div className="market-item">
                <TrendingUp size={12} />
                <span>24h Volume: $1,234,567</span>
              </div>
              <div className="market-item">
                <TrendingUp size={12} />
                <span>Total Liquidity: $9,876,543</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
