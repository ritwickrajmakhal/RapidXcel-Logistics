import React, { useState } from 'react';
import './style.css';
import InventoryReports from './InventoryReports';
import OrderPerformance from './OrderPerformance';
import SalesAndProductAnalysis from './SalesAndProductAnalysis';

const Analytics = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    return (
        <div className="analytics-container">
            <header>
                <div className="logo">
                    <h1>Inventory Reporting</h1>
                </div>
            </header>

            <nav>
                <ul>
                    <li><a href="#inventory-reports">Inventory Reports</a></li>
                    <li><a href="#order-performance">Order Performance</a></li>
                    <li><a href="#sales">Sales & Product Analytics</a></li>
                </ul>
            </nav>

            <main>
                <section id="filters">
                    <h2>Filter Analytics</h2>
                    <form id="analytics-form">
                        <div>
                            <label htmlFor="start-date">Select Date Range:</label>
                            <input type="date" id="start-date" name="start-date" required
                                   value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <span>to</span>
                            <input type="date" id="end-date" name="end-date" required
                                   value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </form>
                </section>

                <InventoryReports startDate={startDate} endDate={endDate} />

                <OrderPerformance startDate={startDate} endDate={endDate} />
                
                <SalesAndProductAnalysis startDate={startDate} endDate={endDate} />
            </main>

            <footer>
                <p>© 2024 Inventory Management Dashboard | All rights reserved</p>
            </footer>
        </div>
    );
};

export default Analytics;