import React, {useEffect, useRef, useState} from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LiquidityManagerApp = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchOrders = async () => {
  const response = await fetch('http://localhost:8080/orders');

  if (!response.ok) {
    throw new Error(await response.text());
  }

  setOrders(await response.json());
  };

  const fetchChartData = async () => {
    const response = await fetch('http://localhost:8080/yields');

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json()
    const chartData = {
      labels: data.maturities,
      datasets: [{
        // xAxis: "Term",
        // yAxis: "%APY",
        label: '%APY',
        data: data.rates,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.0,
        fill: true
      }]
  };

  setChartData(chartData);
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString()
  };

  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    term: '',
    amount: '',
    time: ''
  });

  const [chartData, setChartData] = useState({})

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  fetchOrders();
  }, []);

  useEffect(() => {
  fetchChartData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'right'
            }
          },
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return value;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.term || !formData.amount) {
      alert('Please fill in all fields');
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok){
          const errorText = await response.text();
          console.log("Error: ", errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      setFormData({ term: '', amount: '' });
      fetchOrders()
    } catch (error) {
      setFormData({ term: '', amount: '' });
      alert('Order failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div>
          <h1>
            Liquidity Manager
          </h1>
        <div>
          <h2>
            Today's Yield Curve
          </h2>
          <div>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div>
          <div>
            <h2>Submit New Order</h2>
            <div>
              <div>
                <label>
                  Term
                </label>
                <input
                    type="text"
                    name="term"
                    value={formData.term}
                    onChange={handleInputChange}
                    placeholder="Maturity to Order"
                />
              </div>
              <div>
                <label>
                  Amount ($)
                </label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="100.00"
                    placeholder="Amount to Order"
                />
              </div>
              <button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </div>

          <section>
            <h3>Historical Orders</h3>
            <ul>
              {orders.map((order, index) => (
                <li key={`${order.term}-${order.time}-${index}`}>
                  <strong>{order.term}</strong> — $
                  {order.amount.toFixed(2)} —{' '}
                  {formatDate(order.time)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

function App() {
  return <LiquidityManagerApp />;
}

export default App;