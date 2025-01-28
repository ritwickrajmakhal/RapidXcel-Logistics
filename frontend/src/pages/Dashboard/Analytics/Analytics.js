import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './style.css';
import { toast } from 'react-toastify';

const Analytics = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Refs to store chart instances
    const ordersChartRef = useRef(null);
    const ordersPieChartRef = useRef(null);
    const lineChartRef = useRef(null);

    useEffect(() => {
        if (startDate && endDate) {
            updateCharts();
        }
    }, [startDate, endDate]);

    const updateCharts = async () => {
        // Destroy existing charts if they exist
        if (ordersChartRef.current) {
            ordersChartRef.current.destroy();
        }
        if (ordersPieChartRef.current) {
            ordersPieChartRef.current.destroy();
        }
        if (lineChartRef.current) {
            lineChartRef.current.destroy();
        }

        const realData = await fetchAnalyticsData(startDate, endDate);

        if (realData && realData.labels.length > 0) {
            // Bar chart (Order Performance)
            const ctxOrders = document.getElementById('ordersChart').getContext('2d');
            ordersChartRef.current = new Chart(ctxOrders, {
                type: 'bar',
                data: {
                    labels: realData.labels,
                    datasets: [{
                        label: 'Orders',
                        data: realData.orderData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: "Number of Orders" }
                        },
                        x: {
                            title: { display: true, text: "Months" }
                        }
                    }
                }
            });

            // Pie chart (Order distribution)
            const ctxPie = document.getElementById('ordersPieChart').getContext('2d');
            ordersPieChartRef.current = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: realData.labels,
                    datasets: [{
                        label: 'Orders',
                        data: realData.orderData,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return tooltipItem.label + ': ' + tooltipItem.raw + ' orders';
                                }
                            }
                        }
                    }
                }
            });

            // Line chart (Orders Trend)
            const ctxLine = document.getElementById('lineChart').getContext('2d');
            lineChartRef.current = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: realData.labels,
                    datasets: [{
                        label: 'Orders Trend',
                        data: realData.orderData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: "Number of Orders" }
                        },
                        x: {
                            title: { display: true, text: "Months" }
                        }
                    }
                }
            });

        } else {
            toast.error('No data available for the selected date range');
        }
    };

    const fetchAnalyticsData = async (startDate, endDate) => {
        const response = await fetch(`${BACKEND_URL}/api/analytics?startDate=${startDate}&endDate=${endDate}`, {
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateCharts();
    };

    return (
        <div className="analytics-container">
            <header>
                <div className="logo">
                    <h1>Inventory Reporting</h1>
                </div>
            </header>

            <nav>
                <ul>
                    <li><a href="#inventory">Inventory Reports</a></li>
                    <li><a href="#order-performance">Order Performance</a></li>
                    <li><a href="#sales">Sales & Product Analytics</a></li>
                </ul>
            </nav>

            <main>
                <section id="filters">
                    <h2>Filter Analytics</h2>
                    <form id="analytics-form" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="start-date">Select Date Range:</label>
                            <input type="date" id="start-date" name="start-date" required
                                   value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <span>to</span>
                            <input type="date" id="end-date" name="end-date" required
                                   value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        <button type="submit">Generate Analytics</button>
                    </form>
                </section>

                <section id="order-performance" className="section">
                    <h2>Order Performance</h2>
                    <div className="charts">
                        <div className="chart-container">
                            <canvas id="ordersChart" style={{ width: '100%', height: '400px' }}></canvas>
                        </div>
                        <div className="chart-container">
                            <canvas id="ordersPieChart" style={{ width: '100%', height: '400px' }}></canvas>
                        </div>
                        <div className="chart-container">
                            <canvas id="lineChart" style={{ width: '100%', height: '300px' }}></canvas>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p>© 2024 Inventory Management Dashboard | All rights reserved</p>
            </footer>
        </div>
    );
};

export default Analytics;