import React, { useState } from 'react';
import { Search } from 'lucide-react';

function TokenSelector({ selectedToken, onSelectToken, tokens }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="token-selector">
      <button onClick={() => setIsOpen(!isOpen)} className="token-selector-btn">
        {selectedToken ? (
          <>
            <img src={selectedToken.logoURI} alt={selectedToken.symbol} />
            <span>{selectedToken.symbol}</span>
          </>
        ) : (
          'Select Token'
        )}
      </button>
      {isOpen && (
        <div className="token-list">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search tokens"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="token-grid">
            {filteredTokens.map(token => (
              <div
                key={token.address}
                className="token-item"
                onClick={() => {
                  onSelectToken(token);
                  setIsOpen(false);
                }}
              >
                <img src={token.logoURI} alt={token.symbol} />
                <span>{token.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TokenSelector;
