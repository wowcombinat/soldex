import React from 'react';

function FarmComponent() {
  const farms = [
    { pair: 'SOL/USDC', rewards: 'RAY', apy: '20%' },
    { pair: 'RAY/SOL', rewards: 'RAY', apy: '25%' },
    { pair: 'SRM/USDC', rewards: 'SRM', apy: '18%' },
  ];

  return (
    <div className="farm-container">
      <h2>Yield Farming</h2>
      {farms.map((farm, index) => (
        <div key={index} className="farm-item">
          <h3>{farm.pair}</h3>
          <p>Rewards: {farm.rewards}</p>
          <p>APY: {farm.apy}</p>
          <button className="stake-btn">Stake</button>
        </div>
      ))}
    </div>
  );
}

export default FarmComponent;
