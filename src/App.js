import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Wallet, RefreshCw, Info, DollarSign, Settings, TrendingUp, Clock, Moon, Sun } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const tokenList = [
  { symbol: 'SOL', name: 'Solana', balance: 10, color: '#00FFA3' },
  { symbol: 'USDC', name: 'USD Coin', balance: 1000, color: '#2775CA' },
  { symbol: 'RAY', name: 'Raydium', balance: 100, color: '#E84142' },
  { symbol: 'SRM', name: 'Serum', balance: 500, color: '#3B3B98' },
];

function App() {
  const [activeTab, setActiveTab] = useState('swap');
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [balances, setBalances] = useState({});
  const [recentTrades, setRecentTrades] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const simulatedRate = (Math.random() * 10 + 1).toFixed(6);
      setExchangeRate(simulatedRate);
      setToAmount((parseFloat(fromAmount) * simulatedRate).toFixed(6));
    }
    generateChartData();
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

  const generateChartData = () => {
    const labels = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    const data = {
      labels,
      datasets: [
        {
          label: `${fromToken}/${toToken} Price`,
          data: labels.map(() => Math.random() * 100),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
      ],
    };

    setChartData(data);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="App-header">
        <h1>Solana DEX</h1>
        <div className="header-right">
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
          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      <main className="App-main">
        <div className="tabs">
          <button className={activeTab === 'swap' ? 'active' : ''} onClick={() => setActiveTab('swap')}>Swap</button>
          <button className={activeTab === 'pool' ? 'active' : ''} onClick={() => setActiveTab('pool')}>Pool</button>
          <button className={activeTab === 'farm' ? 'active' : ''} onClick={() => setActiveTab('farm')}>Farm</button>
        </div>
        {activeTab === 'swap' && (
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
        )}
        {activeTab === 'pool' && (
          <div className="pool-container">
            <h2>Liquidity Pool</h2>
            <p>Add liquidity to earn fees</p>
            {/* Add liquidity form here */}
          </div>
        )}
        {activeTab === 'farm' && (
          <div className="farm-container">
            <h2>Yield Farming</h2>
            <p>Stake your LP tokens to earn rewards</p>
            {/* Add farming options here */}
          </div>
        )}
        <button className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Hide' : 'Show'} Advanced Info
        </button>
        {showAdvanced && (
          <div className="advanced-info">
            <div className="chart-container">
              <h3>Price Chart</h3>
              {chartData && <Line data={chartData} />}
            </div>
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
