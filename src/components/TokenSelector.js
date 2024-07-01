import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const SOLANA_TOKENS = [
  { symbol: 'SOL', name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=024' },
  { symbol: 'USDC', name: 'USD Coin', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=024' },
  { symbol: 'RAY', name: 'Raydium', logo: 'https://cryptologos.cc/logos/raydium-ray-logo.svg?v=024' },
  { symbol: 'SRM', name: 'Serum', logo: 'https://cryptologos.cc/logos/serum-srm-logo.svg?v=024' },
  // Добавьте больше токенов Solana здесь
];

function TokenSelector({ selectedToken, onSelectToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTokens, setFilteredTokens] = useState(SOLANA_TOKENS);

  useEffect(() => {
    setFilteredTokens(
      SOLANA_TOKENS.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className="token-selector">
      <button onClick={() => setIsOpen(!isOpen)} className="token-selector-button">
        {selectedToken ? (
          <>
            <img src={selectedToken.logo} alt={selectedToken.symbol} className="token-logo" />
            <span>{selectedToken.symbol}</span>
          </>
        ) : (
          'Select Token'
        )}
        <ChevronDown size={20} />
      </button>
      {isOpen && (
        <div className="token-dropdown">
          <div className="token-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search tokens"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="token-list">
            {filteredTokens.map(token => (
              <div
                key={token.symbol}
                className="token-item"
                onClick={() => {
                  onSelectToken(token);
                  setIsOpen(false);
                }}
              >
                <img src={token.logo} alt={token.symbol} className="token-logo" />
                <div className="token-info">
                  <span className="token-symbol">{token.symbol}</span>
                  <span className="token-name">{token.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TokenSelector;
