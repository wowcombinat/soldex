import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Wallet, Sun, Moon, Search, ArrowUpDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import TokenSelector from './components/TokenSelector';
import NotificationCenter from './components/NotificationCenter';
import { connectWallet, getTokenBalance, swapTokens } from './services/walletService';
import { getTokenPrice, getTop100Tokens } from './services/tokenService';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [balances, setBalances] = useState({});
  const [recentTrades, setRecentTrades] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [topTokens, setTopTokens] = useState([]);

  useEffect(() => {
    getTop100Tokens().then(setTopTokens);
  }, []);

  useEffect(() => {
    if (fromToken && toToken) {
      getTokenPrice(fromToken.address, toToken.address).then(setExchangeRate);
    }
  }, [fromToken, toToken]);

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      setWalletConnected(true);
      updateBalances(address);
    } catch (error) {
      addNotification('Failed to connect wallet', 'error');
    }
  };

  const updateBalances = async (address) => {
    const newBalances = {};
    for (let token of topTokens) {
      newBalances[token.symbol] = await getTokenBalance(address, token.address);
    }
    setBalances(newBalances);
  };

  const handleSwap = async () => {
    if (!walletConnected) {
      addNotification('Please connect your wallet first', 'error');
      return;
    }
    try {
      await swapTokens(fromToken.address, toToken.address, fromAmount);
      addNotification(`Swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`, 'success');
      updateBalances(walletAddress);
      setRecentTrades(prev => [{
        from: fromToken.symbol,
        to: toToken.symbol,
        amount: fromAmount,
        date: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]);
    } catch (error) {
      addNotification('Swap failed', 'error');
    }
  };

  const addNotification = (message, type) => {
    const newNotification = { message, type, id: Date.now() };
    setNotifications(prev => [newNotification, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <header className="App-header">
          <h1>Solana DEX</h1>
          <nav>
            <Link to="/">Swap</Link>
            <Link to="/charts">Charts</Link>
            <Link to="/history">History</Link>
          </nav>
          <div className="header-right">
            {walletConnected ? (
              <div className="wallet-info">
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
            ) : (
              <button onClick={handleConnectWallet} className="connect-wallet-btn">
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
          <Routes>
            <Route path="/" element={
              <div className="swap-container">
                <h2>Swap</h2>
                <div className="token-inputs">
                  <div className="token-input">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                    />
                    <TokenSelector
                      selectedToken={fromToken}
                      onSelectToken={setFromToken}
                      tokens={topTokens}
                    />
                  </div>
                  <button className="switch-tokens-btn" onClick={() => {
                    setFromToken(toToken);
                    setToToken(fromToken);
                    setFromAmount(toAmount);
                    setToAmount(fromAmount);
                  }}>
                    <ArrowUpDown size={24} />
                  </button>
                  <div className="token-input">
                    <input
                      type="number"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      placeholder="0.0"
                    />
                    <TokenSelector
                      selectedToken={toToken}
                      onSelectToken={setToToken}
                      tokens={topTokens}
                    />
                  </div>
                </div>
                {exchangeRate && (
                  <div className="exchange-rate">
                    <span>1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}</span>
                  </div>
                )}
                <button onClick={handleSwap} className="swap-btn">
                  Swap
                </button>
              </div>
            } />
            <Route path="/charts" element={<div>Charts coming soon</div>} />
            <Route path="/history" element={
              <div className="history-container">
                <h2>Recent Trades</h2>
                <ul>
                  {recentTrades.map((trade, index) => (
                    <li key={index}>
                      {trade.date}: Swapped {trade.amount} {trade.from} to {trade.to}
                    </li>
                  ))}
                </ul>
              </div>
            } />
          </Routes>
        </main>
        <NotificationCenter notifications={notifications} />
      </div>
    </Router>
  );
}

export default App;
