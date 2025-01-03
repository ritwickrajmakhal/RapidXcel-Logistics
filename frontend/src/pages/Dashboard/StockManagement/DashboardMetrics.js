import React from 'react';
import './css/DashboardMetrics.css';

const metrics = [
  { title: 'Total Items',  color: 'purple' },
  { title: 'Total Sales', color: 'green' },
  { title: 'Total Products',  color: 'blue' },
  { title: 'Paid Orders',  color: 'green' },
  { title: 'UnPaid Orders',  color: 'red' },
  
];

function DashboardMetrics() {
  return (
    <div className="dashboard-metrics">
      {metrics.map((metric, index) => (
        <div key={index} className={`card ${metric.color}`}>
          <h3>{metric.count}</h3>
          <p>{metric.title}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardMetrics;