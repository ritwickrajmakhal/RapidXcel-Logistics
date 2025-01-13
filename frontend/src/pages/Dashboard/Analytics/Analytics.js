import React, { useEffect, useRef } from "react";
import "./style.css";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
} from "chart.js";

// Register components for Chart.js
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement
);

const Analytics = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const salesChartRef = useRef(null);
  const profitChartRef = useRef(null);

  useEffect(() => {
    const form = document.getElementById("analytics-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }

      const analyticsData = await fetchAnalyticsData(BACKEND_URL, startDate, endDate);
      if (analyticsData) {
        updateCharts(analyticsData);
      }
    });
  }, [BACKEND_URL]);

  const fetchAnalyticsData = async (url, startDate, endDate) => {
    try {
      const response = await fetch(
        `${url}/api/analytics?startDate=${startDate}&endDate=${endDate}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      return await response.json();
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const updateCharts = (data) => {
    // Destroy existing charts to reuse canvas
    if (salesChartRef.current) {
      salesChartRef.current.destroy();
    }
    if (profitChartRef.current) {
      profitChartRef.current.destroy();
    }

    // Create new charts
    const salesChartCtx = document.getElementById("productSalesChart").getContext("2d");
    const profitChartCtx = document.getElementById("profitLossChart").getContext("2d");

    salesChartRef.current = new Chart(salesChartCtx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Sales",
            data: data.salesData,
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.label}: $${tooltipItem.raw}`,
            },
          },
        },
      },
    });

    profitChartRef.current = new Chart(profitChartCtx, {
      type: "pie",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.profitsData,
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.label}: $${tooltipItem.raw}`,
            },
          },
        },
      },
    });
  };

  return (
    <div className="analytics-container">
      <Header />
      <NavBar />
      <MainContent />
    </div>
  );
};

const Header = () => (
  <header>
    <div className="logo">
      <h1>Inventory Reporting</h1>
    </div>
  </header>
);

const NavBar = () => (
  <nav>
    <ul>
      <li>
        <a href="#inventory">Inventory Reports</a>
      </li>
      <li>
        <a href="#order-performance">Order Performance</a>
      </li>
      <li>
        <a href="#sales">Sales & Product Analytics</a>
      </li>
    </ul>
  </nav>
);

const MainContent = () => (
  <main>
    <FilterSection />
    <AnalyticsSection />
  </main>
);

const FilterSection = () => (
  <section id="filters">
    <h2>Filter Analytics</h2>
    <form id="analytics-form">
      <div>
        <label htmlFor="start-date">Select Date Range:</label>
        <input type="date" id="start-date" name="start-date" />
        <input type="date" id="end-date" name="end-date" />
      </div>
      <button type="submit">Generate Analytics</button>
    </form>
  </section>
);

const AnalyticsSection = () => (
  <section id="sales" className="section">
    <h2>Sales & Product Analytics</h2>
    <div className="charts">
      <div className="chart-container">
        <canvas id="productSalesChart"></canvas>
      </div>
      <div className="chart-container">
        <canvas id="profitLossChart"></canvas>
      </div>
    </div>
  </section>
);

export default Analytics;
