import React from 'react';

function PoolComponent() {
  const pools = [
    { pair: 'SOL/USDC', liquidity: '1,000,000', apy: '5%' },
    { pair: 'RAY/SOL', liquidity: '500,000', apy: '7%' },
    { pair: 'SRM/USDC', liquidity: '750,000', apy: '6%' },
  ];

  return (
    <div className="pool-container">
      <h2>Liquidity Pools</h2>
      {pools.map((pool, index) => (
        <div key={index} className="pool-item">
          <h3>{pool.pair}</h3>
          <p>Liquidity: ${pool.liquidity}</p>
          <p>APY: {pool.apy}</p>
          <button className="add-liquidity-btn">Add Liquidity</button>
        </div>
      ))}
    </div>
  );
}

export default PoolComponent;
