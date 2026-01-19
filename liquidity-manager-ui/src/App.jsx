import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
    console.log("Fetching orders")
  const response = await fetch('http://localhost:8080/orders');

  if (!response.ok) {
    console.log("fetch order response was not ok: ", response.status)
    throw new Error(await response.text());
  }

  setOrders(await response.json());
  };

  const fetchChartData = async () => {
    const response = await fetch('http://localhost:8080/yields');

    if (!response.ok) {
      console.log("fetch order response was not ok: ", response.status)
      throw new Error(await response.text());
    }

    const data = await response.json()
    const chartData = {
      labels: data.maturities,
      datasets: [{
        label: 'Yield (APY)',
        data: data.rates,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
  };

  setChartData(chartData);
  };

// const formatDate = (isoString) => {
//   console.log("formatting date")

//   if (isoString == null) return null

//   console.log(isoString)
//   // console.log(isoString.slice(0,19) + 'Z')
//   newDate = Date.parse("2026-01-19") //.toLocaleDateString()
//   console.log(newDate)
//   return newDate
// };


  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    term: '',
    amount: '',
    time: ''
  });

  const [chartData, setChartData] = useState({})

  const [submitting, setSubmitting] = useState(false);

  // Chart data based on orders



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
      console.log(response)

      if (!response.ok){
        console.log("ok was ", response.ok)
        console.log("Response was not ok: ", response.status)
          const errorText = await response.text();
          console.log("Error: ", errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      else {
        console.log("Success!")
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Liquidity Manager
          </h1>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Today's Yield Curve
          </h2>
          <div className="h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Submit New Order</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Term
                </label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Maturity to Order"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount to Order"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </div>

          {/* Order History */}
          <section>
            <h3>Historical Orders</h3>
            <ul>
              {orders.map((order, index) => (
                <li key={`${order.term}-${order.time}-${index}`}>
                  <strong>{order.term}</strong> — $
                  {order.amount.toFixed(2)} —{' '}
                  {order.time}
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