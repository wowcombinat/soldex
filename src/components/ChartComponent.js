import React from 'react';
import { Line } from 'react-chartjs-2';

function ChartComponent() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Token Price',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="chart-container">
      <h2>Price Chart</h2>
      <Line data={data} />
    </div>
  );
}

export default ChartComponent;
