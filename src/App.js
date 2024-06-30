import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Wallet, RefreshCw, Info, DollarSign, Settings, TrendingUp, Clock, Moon, Sun, Plus, Minus } from 'lucide-react';
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
  const [notifications, setNotifications] = useState([]);
  const [liquidityPools, setLiquidityPools] = useState([
    { pair: 'SOL-USDC', liquidity: 1000000, apy: 12 },
    { pair: 'RAY-USDC', liquidity: 500000, apy: 18 },
    { pair: 'SRM-USDC', liquidity: 250000, apy: 15 },
  ]);

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
      addNotification('Insufficient balance', 'error');
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

    addNotification(`Swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`, 'success');
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
    addNotification('Wallet connected successfully', 'success');
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

  const addNotification = (message, type) => {
    const newNotification = { message, type, id: Date.now() };
    setNotifications(prev => [newNotification, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const addLiquidity = (pair, amount) => {
    setLiquidityPools(prev => 
      prev.map(pool => 
        pool.pair === pair 
          ? {...pool, liquidity: pool.liquidity + amount} 
          : pool
      )
    );
    addNotification(`Added ${amount} liquidity to ${pair} pool`, 'success');
  };

  const removeLiquidity = (pair, amount) => {
    setLiquidityPools(prev => 
      prev.map(pool => 
        pool.pair === pair 
          ? {...pool, liquidity: Math.max(0, pool.liquidity - amount)} 
          : pool
      )
    );
    addNotification(`Removed ${amount} liquidity from ${pair} pool`, 'success');
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
            {/* Swap content (unchanged) */}
          </div>
        )}
        {activeTab === 'pool' && (
          <div className="pool-container">
            <h2>Liquidity Pools</h2>
            {liquidityPools.map(pool => (
              <div key={pool.pair} className="pool-item">
                <h3>{pool.pair}</h3>
                <p>Liquidity: ${pool.liquidity.toLocaleString()}</p>
                <p>APY: {pool.apy}%</p>
                <div className="pool-actions">
                  <button onClick={() => addLiquidity(pool.pair, 1000)}>
                    <Plus size={16} /> Add Liquidity
                  </button>
                  <button onClick={() => removeLiquidity(pool.pair, 1000)}>
                    <Minus size={16} /> Remove Liquidity
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'farm' && (
          <div className="farm-container">
            <h2>Yield Farming</h2>
            <p>Stake your LP tokens to earn rewards</p>
            {/* Add farming options here */}
          </div>
        )}
        {/* Advanced info section (unchanged) */}
      </main>
      <div className="notifications">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
