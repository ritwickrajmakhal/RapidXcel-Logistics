import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { toast } from "react-toastify";

const SalesAndProductAnalysis = ({ startDate, endDate }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const salesLineChartRef = useRef(null);

  useEffect(() => {
    if (startDate && endDate) {
      updateCharts();
    }
  }, [startDate, endDate]);

  const updateCharts = async () => {
    // Destroy existing charts if they exist
    if (salesLineChartRef.current) {
      salesLineChartRef.current.destroy();
    }

    const { product_sales_trends } = await fetchSalesReportData(
      startDate,
      endDate
    );

    if (product_sales_trends) {
      const datasets = [];

      // Add bestsellers to datasets
      product_sales_trends.bestsellers.forEach((product, index) => {
        datasets.push({
          label: `Bestseller: ${product[0]}`,
          data: product[1].quantities,
          borderColor: `rgba(75, 192, 192, ${1 - index * 0.2})`,
          backgroundColor: `rgba(75, 192, 192, ${0.2 - index * 0.04})`,
          fill: false,
          tension: 0.4,
          borderWidth: 2,
        });
      });

      // Add low performers to datasets
      product_sales_trends.low_performers.forEach((product, index) => {
        datasets.push({
          label: `Low Performer: ${product[0]}`,
          data: product[1].quantities,
          borderColor: `rgba(255, 99, 132, ${1 - index * 0.2})`,
          backgroundColor: `rgba(255, 99, 132, ${0.2 - index * 0.04})`,
          fill: false,
          tension: 0.4,
          borderWidth: 2,
        });
      });

      const ctxLine = document
        .getElementById("salesLineChart")
        .getContext("2d");
      salesLineChartRef.current = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: product_sales_trends.bestsellers[0][1].months, // Assuming all products have the same months
          datasets: datasets,
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  };

  const fetchSalesReportData = async (startDate, endDate) => {
    const response = await fetch(
      `${BACKEND_URL}/api/sales-reports?startDate=${startDate}&endDate=${endDate}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  };
  return (
    <section id="sales">
      <h2>Sales & Product Analytics</h2>
      <div className="charts d-flex gap-4">
        <div className="chart-container" style={{ height: "400px" }}>
          <canvas id="salesLineChart"></canvas>
        </div>
      </div>
    </section>
  );
};

export default SalesAndProductAnalysis;
