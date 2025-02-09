import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { toast } from "react-toastify";

const OrderPerformance = ({ startDate, endDate }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const ordersLineChart1Ref = useRef(null);
  const ordersLineChart2Ref = useRef(null);

  useEffect(() => {
    if (startDate && endDate) {
      updateCharts();
    }
  }, [startDate, endDate]);

  const updateCharts = async () => {
    // Destroy existing charts if they exist
    if (ordersLineChart1Ref.current) {
      ordersLineChart1Ref.current.destroy();
    }
    if (ordersLineChart2Ref.current) {
      ordersLineChart2Ref.current.destroy();
    }

    const { order_fulfilment_rate, order_volume_trends } =
      await fetchAnalyticsData(startDate, endDate);

    if (order_fulfilment_rate && order_fulfilment_rate.months.length > 0) {
      // Line chart (Orders Trend)
        console.log(order_volume_trends.total_orders, );
        
      const ctxLine = document
        .getElementById("ordersLineChart1")
        .getContext("2d");
      ordersLineChart1Ref.current = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: order_fulfilment_rate.months,
          datasets: [
            {
              label: "Total Orders",
              data: order_fulfilment_rate.total_orders,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            },
            {
                label: "Fulfilled Orders",
                data: order_fulfilment_rate.fulfilled_orders,
                borderColor: "rgb(255, 0, 0)",
                backgroundColor: "rgb(249, 167, 154)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
              },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Number of Orders" },
            },
            x: {
              title: { display: true, text: "Months" },
            },
          },
        },
      });
    } else {
      toast.error(
        "No data available for the selected date range for Order volume trends."
      );
    }

    if (order_volume_trends && order_volume_trends.months.length > 0) {
      // Line chart (Orders Trend)

      const ctxLine = document
        .getElementById("ordersLineChart2")
        .getContext("2d");
      ordersLineChart2Ref.current = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: order_volume_trends.months,
          datasets: [
            {
              label: "Orders",
              data: order_volume_trends.order_counts,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Number of Orders" },
            },
            x: {
              title: { display: true, text: "Months" },
            },
          },
        },
      });
    } else {
      toast.error(
        "No data available for the selected date range for Order volume trends."
      );
    }
  };

  const fetchAnalyticsData = async (startDate, endDate) => {
    const response = await fetch(
      `${BACKEND_URL}/api/order-performance-and-demand-analysis?startDate=${startDate}&endDate=${endDate}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(data);

    return data;
  };
  return (
    <section id="order-performance">
      <h2>Order Performance</h2>
      <div className="charts d-flex gap-4">
        <div className="chart-container" style={{ height: "400px" }}>
          <canvas id="ordersLineChart1"></canvas>
        </div>
        <div className="chart-container" style={{ height: "400px" }}>
          <canvas id="ordersLineChart2"></canvas>
        </div>
      </div>
    </section>
  );
};

export default OrderPerformance;
