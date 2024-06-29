import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Wallet, RefreshCw, Info, DollarSign, Settings, ChevronDown, TrendingUp, Clock, Zap } from 'lucide-react';

const tokenList = [
  { symbol: 'SOL', name: 'Solana', logo: '/sol-logo.png' },
  { symbol: 'USDC', name: 'USD Coin', logo: '/usdc-logo.png' },
  { symbol: 'RAY', name: 'Raydium', logo: '/ray-logo.png' },
  { symbol: 'SRM', name: 'Serum', logo: '/srm-logo.png' },
  { symbol: 'SAMO', name: 'Samoyedcoin', logo: '/samo-logo.png' },
  { symbol: 'ORCA', name: 'Orca', logo: '/orca-logo.png' },
  { symbol: 'BONK', name: 'Bonk', logo: '/bonk-logo.png' },
  { symbol: 'MNGO', name: 'Mango', logo: '/mngo-logo.png' },
];

const TradingChart = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Price Chart</h2>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <span className="text-gray-400">Trading chart placeholder</span>
      </div>
    </div>
  );
};

const OrderBook = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Order Book</h2>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>Price (USDC)</div>
        <div>Amount (SOL)</div>
        <div>Total (USDC)</div>
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="text-green-600">{(Math.random() * 100 + 50).toFixed(2)}</div>
            <div>{(Math.random() * 10).toFixed(4)}</div>
            <div>{(Math.random() * 1000 + 500).toFixed(2)}</div>
          </React.Fragment>
        ))}
        <div className="col-span-3 text-center font-semibold my-2">Market Price: 75.50 USDC</div>
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="text-red-600">{(Math.random() * 100 + 50).toFixed(2)}</div>
            <div>{(Math.random() * 10).toFixed(4)}</div>
            <div>{(Math.random() * 1000 + 500).toFixed(2)}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const MarketOverview = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        {['SOL/USDC', 'RAY/USDC', 'SRM/USDC'].map((pair) => (
          <div key={pair} className="bg-gray-100 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{pair}</span>
              <span className={`text-sm ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                {(Math.random() * 2 - 1).toFixed(2)}%
              </span>
            </div>
            <div className="text-lg font-bold">${(Math.random() * 100 + 10).toFixed(2)}</div>
            <div className="text-sm text-gray-500">
              Volume: ${(Math.random() * 1000000 + 100000).toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LiquidityPoolInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Liquidity Pools</h2>
      <div className="space-y-3">
        {['SOL-USDC', 'RAY-USDC', 'SRM-USDC'].map((pool) => (
          <div key={pool} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <div>
              <div className="font-medium">{pool}</div>
              <div className="text-sm text-gray-500">TVL: ${(Math.random() * 10000000 + 1000000).toFixed(0)}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{(Math.random() * 100 + 10).toFixed(2)}% APR</div>
              <button className="text-sm text-blue-600 hover:underline">Add Liquidity</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CompleteSolanaSwapPlatform() {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [recentTrades, setRecentTrades] = useState([]);
  const [walletBalance, setWalletBalance] = useState({ SOL: 0, USDC: 0 });
  const [showAdvancedTrading, setShowAdvancedTrading] = useState(false);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [activeTab, setActiveTab] = useState('swap');

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const simulatedRate = Math.random() * 10;
      setExchangeRate(simulatedRate);
      setToAmount((parseFloat(fromAmount) * simulatedRate).toFixed(6));
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = () => {
    const newTrade = {
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      date: new Date().toLocaleString(),
      type: orderType,
      price: orderType === 'limit' ? limitPrice : (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)
    };
    setRecentTrades([newTrade, ...recentTrades.slice(0, 4)]);
    
    setWalletBalance(prev => ({
      ...prev,
      [fromToken]: prev[fromToken] - parseFloat(fromAmount),
      [toToken]: prev[toToken] + parseFloat(toAmount)
    }));

    setFromAmount('');
    setToAmount('');
  };

  const connectWallet = () => {
    setWalletConnected(true);
    setWalletBalance({ SOL: 10, USDC: 1000 });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <header className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Solana Swap Platform</h1>
          {walletConnected ? (
            <div className="flex items-center">
              <span className="mr-2">
                {walletBalance.SOL.toFixed(2)} SOL | {walletBalance.USDC.toFixed(2)} USDC
              </span>
              <button className="bg-gray-200 p-2 rounded-full">
                <Wallet size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex space-x-4">
        <div className="w-1/3 space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 ${activeTab === 'swap' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-l-lg`}
                onClick={() => setActiveTab('swap')}
              >
                Swap
              </button>
              <button
                className={`flex-1 py-2 ${activeTab === 'pool' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-r-lg`}
                onClick={() => setActiveTab('pool')}
              >
                Pool
              </button>
            </div>

            {activeTab === 'swap' ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Swap</h2>
                  <button onClick={() => setShowSettings(!showSettings)} className="text-gray-600 hover:text-gray-800">
                    <Settings size={20} />
                  </button>
                </div>

                {showSettings && (
                  <div className="mb-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="font-semibold mb-2">Settings</h3>
                    <div className="flex items-center">
                      <label className="mr-2">Slippage tolerance:</label>
                      <input 
                        type="number" 
                        value={slippage} 
                        onChange={(e) => setSlippage(e.target.value)}
                        className="border rounded px-2 py-1 w-16"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="flex items-center bg-gray-100 rounded-md p-2">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-grow bg-transparent outline-none"
                    />
                    <select 
                      className="ml-2 bg-transparent"
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                    >
                      {tokenList.map((token) => (
                        <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                      ))}
                    </select>
                  </div>
                  {walletConnected && (
                    <p className="text-xs text-gray-500 mt-1">
                      Balance: {walletBalance[fromToken]} {fromToken}
                    </p>
                  )}
                </div>

                <div className="flex justify-center my-4">
                  <button className="bg-gray-200 p-2 rounded-full" onClick={() => {
                    const temp = fromToken;
                    setFromToken(toToken);
                    setToToken(temp);
                  }}>
                    <ArrowDownUp size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="flex items-center bg-gray-100 rounded-md p-2">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="flex-grow bg-transparent outline-none"
                    />
                    <select 
                      className="ml-2 bg-transparent"
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                    >
                      {tokenList.map((token) => (
                        <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                      ))}
                      <option value="custom">Custom Token</option>
                    </select>
                  </div>
                  {walletConnected && (
                    <p className="text-xs text-gray-500 mt-1">
                      Balance: {walletBalance[toToken]} {toToken}
                    </p>
                  )}
                </div>

                {toToken === 'custom' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Token Address</label>
                    <input
                      type="text"
                      placeholder="Enter token contract address"
                      value={customTokenAddress}
                      onChange={(e) => setCustomTokenAddress(e.target.value)}
                      className="w-full p-2 bg-gray-100 rounded-md outline-none"
                    />
                  </div>
                )}

                {exchangeRate && (
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>Exchange Rate:</span>
                    <span>1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}</span>
                    <button className="text-blue-500 hover:text-blue-700">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                )}

                <div className="mb-4">
                  <button
                    onClick={() => setShowAdvancedTrading(!showAdvancedTrading)}
                    className="w-full bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 transition duration-300 flex items-center justify-between"
                  >
                    Advanced Trading
                    <ChevronDown size={20} className={`transform ${showAdvancedTrading ? 'rotate-180' : ''} transition-transform`} />
                  </button>
                </div>

                {showAdvancedTrading && (
                  <div className="mb-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="font-semibold mb-2">Order Type</h3>
                    <div className="flex space-x-2 mb-2">
                      <button
                        className={`px-3 py-1 rounded ${orderType === 'market' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setOrderType('market')}
                      >
                        Market
                      </button>
                      <button
                        className={`px-3 py-1 rounded ${orderType === 'limit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setOrderType('limit')}
                      >
                        Limit
                      </button>
                    </div>
                    {orderType === 'limit' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Limit Price</label>
                        <input
                          type="number"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          className="w-full p-2 bg-white rounded-md outline-none border"
                          placeholder="Enter limit price"
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSwap}
                  disabled={!walletConnected}
                  className={`w-full p-3 rounded-md transition duration-300 ${
                    walletConnected
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {walletConnected ? 'Swap' : 'Connect Wallet to Swap'}
                </button>

                <div className="mt-6 text-xs text-gray-500">
                  <p className="flex items-center">
                    <Info size={12} className="mr-1" /> 
                    Always verify contract addresses and transaction details before swapping.
                  </p>
                  <p className="flex items-center mt-1">
                    <DollarSign size={12} className="mr-1" /> 
                    Market prices may change rapidly. Check rates before confirming.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Add Liquidity</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Token 1</label>
                  <div className="flex items-center bg-gray-100 rounded-md p-2">
                    <input
                      type="number"
                      placeholder="0.0"
                      className="flex-grow bg-transparent outline-none"
                    />
                    <select className="ml-2 bg-transparent">
                      {tokenList.map((token) => (
                        <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Token 2</label>
                  <div className="flex items-center bg-gray-100 rounded-md p-2">
                    <input
                      type="number"
                      placeholder="0.0"
                      className="flex-grow bg-transparent outline-none"
                    />
                    <select className="ml-2 bg-transparent">
                      {tokenList.map((token) => (
                        <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Add Liquidity
                </button>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
            <div className="space-y-3">
              {['SOL-USDC', 'RAY-USDC'].map((pool) => (
                <div key={pool} className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{pool}</span>
                    <span className="text-sm text-green-600">+2.5%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Your liquidity: ${(Math.random() * 10000 + 1000).toFixed(2)}
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Add</button>
                    <button className="text-xs bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-2/3 space-y-4">
          <TradingChart />
          <div className="flex space-x-4">
            <div className="w-1/2">
              <OrderBook />
            </div>
            <div className="w-1/2">
              <MarketOverview />
            </div>
          </div>
          <LiquidityPoolInfo />
          
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-2">{new Date().toLocaleTimeString()}</td>
                      <td className={`px-4 py-2 ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.random() > 0.5 ? 'Buy' : 'Sell'}
                      </td>
                      <td className="px-4 py-2">${(Math.random() * 100 + 10).toFixed(2)}</td>
                      <td className="px-4 py-2">{(Math.random() * 10).toFixed(4)} SOL</td>
                      <td className="px-4 py-2">${(Math.random() * 1000 + 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
