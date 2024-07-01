import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Wallet, Sun, Moon, ArrowUpDown } from 'lucide-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import TokenSelector from './components/TokenSelector';
import NotificationCenter from './components/NotificationCenter';
import { swapTokens } from './services/swapService';
import { getTokenPrice, getTop100Tokens } from './services/tokenService';
import ChartComponent from './components/ChartComponent';
import PoolComponent from './components/PoolComponent';
import FarmComponent from './components/FarmComponent';
import './App.css';

const connection = new Connection('https://api.mainnet-beta.solana.com');

function App() {
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [topTokens, setTopTokens] = useState([]);
  const wallet = useWallet();

  useEffect(() => {
    getTop100Tokens().then(setTopTokens);
  }, []);

  useEffect(() => {
    if (fromToken && toToken) {
      getTokenPrice(fromToken.address, toToken.address).then(setExchangeRate);
    }
  }, [fromToken, toToken]);

  const handleSwap = async () => {
    if (!wallet.connected) {
      addNotification('Please connect your wallet first', 'error');
      return;
    }
    try {
      await swapTokens(connection, wallet, fromToken.address, toToken.address, fromAmount);
      addNotification(`Swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`, 'success');
    } catch (error) {
      addNotification('Swap failed: ' + error.message, 'error');
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
            <Link to="/pool">Pool</Link>
            <Link to="/farm">Farm</Link>
            <Link to="/charts">Charts</Link>
          </nav>
          <div className="header-right">
            <WalletMultiButton />
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
                      readOnly
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
            <Route path="/pool" element={<PoolComponent />} />
            <Route path="/farm" element={<FarmComponent />} />
            <Route path="/charts" element={<ChartComponent />} />
          </Routes>
        </main>
        <NotificationCenter notifications={notifications} />
      </div>
    </Router>
  );
}

export default App;
